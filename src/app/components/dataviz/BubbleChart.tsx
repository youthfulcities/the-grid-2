import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  cluster?: string;
  child?: ReactNode | null;
  minWidth?: number;
}

// Define the data structure
interface Node {
  code_level_1: string;
  frequency: number;
  children?: Node[];
}

// Define the props of the component
interface BubbleChartProps {
  width: number;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  city: string;
}

const truncateText = (text: string, maxLength: number) => {
  // Remove anything within parentheses and the parentheses themselves
  if (text) {
    const cleanedText = text.replace(/\(.*?\)/g, '').trim();

    // Truncate the text if it exceeds the maxLength
    if (cleanedText.length > maxLength) {
      return `${cleanedText.slice(0, maxLength)}...`;
    }

    return cleanedText;
  }
};

// Function to calculate luminance of a color
const calculateLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Function to determine if white text is better based on contrast
const shouldUseWhiteText = (color: string) => {
  const rgb = d3.rgb(color);
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  return luminance < 0.3;
};

const BubbleChart: React.FC<BubbleChartProps> = ({
  width,
  tooltipState,
  setTooltipState,
  setCode,
  setIsDrawerOpen,
  city,
}) => {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState({});
  const [parsedData, setParsedData] = useState({});
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);

  console.log(city);

  useEffect(() => {
    const fetchData = async () => {
      if (Object.prototype.hasOwnProperty.call(rawData, city)) return;
      try {
        const downloadResult = await downloadData({
          path: `internal/doc_city=${city}/codes.csv`,
        }).result;
        const text = await downloadResult.body.text();
        setRawData({ ...rawData, [city]: text });
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const parseDynamicCSVData = (city: string, csvString: string) => {
      if (parsedData[city]) return;
      setLoading(true);
      const parsed = d3.csvParse(csvString, (d) => {
        const row = {
          name: d.code_2 || d.code_1,
          parent: d.code_2 ? d.code_1 : 'Root',
          value: +d['count(code_2)'] || 0,
        };
        return row;
      });
      setParsedData({ ...parsedData, [city]: parsed });
      setLoading(false);
    };

    fetchData();
    if (rawData[city]) parseDynamicCSVData(city, rawData[city]);
  }, [city, rawData, parsedData]);

  useEffect(() => {
    if (!parsedData[city] || !width) return;

    const height = width;
    const allData = parsedData[city];
    const syntheticRoot = { name: 'Root', parent: null };
    const combinedData = [syntheticRoot, ...allData];

    const stratify = d3
      .stratify()
      .id((d) => d.name)
      .parentId((d) => d.parent);
    const root = stratify(combinedData);

    // // Flatten nodes and links for the force simulation
    const nodes = root.descendants().slice(1); // Exclude the synthetic root node
    const links = root.links().filter(
      (link) =>
        // Check if the source or target of the link is the synthetic root
        link.source.data.name !== 'Root' && link.target.data.name !== 'Root'
    );

    // Calculate values for parent nodes
    root.each((node) => {
      if (node.data.oldValue) return;
      if (node.children) {
        node.data.oldValue = node.data.value;
        node.data.value += d3.sum(node.children, (child) => child.data.value);
      }
    });

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues) // Choose a color interpolation
      .domain([0, d3.max(nodes, (d) => d.data.value || 0) || 1]);

    // Define radius scale based on the frequency
    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(nodes, (d) => d.data.value || 0) || 1])
      .range([width / 100, width / 10]);

    // Create the simulation for the force-directed graph
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.data.name)
          .distance(width / 10)
      ) // Link distance
      .force('charge', d3.forceManyBody().strength(-width / 10)) // Adjust charge strength
      .force('center', d3.forceCenter(width / 2, height / 2)) // Center the graph
      .force(
        'collision',
        d3.forceCollide().radius((d) => radiusScale(d.data.value) + 5)
      ) // Prevent overlap
      .force(
        'attraction',
        d3
          .forceRadial(
            (d) => radiusScale(d.data.value) / 2,
            width / 2,
            height / 2
          )
          .strength(0.1)
      ); // Attract larger nodes to the center

    // Select the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Remove old nodes and links
    svg.selectAll('g').remove();
    svg.selectAll('line').remove();

    // Add links (lines between nodes)
    const link = svg
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 1.5);

    const node = svg
      .selectAll('g') // Change to group elements to contain both circle and text
      .data(nodes)
      .join('g') // Create a group for each node
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState({
          position: { x: xPos, y: yPos },
          content: d.data.name,
        });
      })
      .on('mousemove', (event) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState((prevTooltipState) => ({
          ...prevTooltipState,
          position: { x: xPos, y: yPos },
        }));
      })
      .on('mouseout', () => {
        setTooltipState({ ...tooltipState, position: null });
      })
      .on('click', (event, d) => {
        setIsDrawerOpen(true);
        setCode(d.data.name);
      }); // Position the group

    // Add nodes (bubbles) as circles
    node
      .append('circle')
      .attr('r', (d) => radiusScale(d.data.value))
      .attr('fill', (d) => colorScale(d.data.value))
      .attr('stroke-width', 1.5);

    // Make the nodes draggable using the drag behavior
    const drag = d3
      .drag<SVGCircleElement, any>()
      .on('start', (event: any, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: any, d: any) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: any, d: any) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Apply drag behavior to the circles (nodes)
    node.call(drag as any); // Cast to 'any' to avoid TypeScript type mismatch issues

    node
      .append('foreignObject')
      .attr('width', (d) => radiusScale(d.data.value) * 2)
      .attr('height', (d) => radiusScale(d.data.value) * 2)
      .attr('x', (d) => -radiusScale(d.data.value))
      .attr('y', (d) => -radiusScale(d.data.value))
      .append('xhtml:div')
      .attr(
        'style',
        `
    width: 100%; 
    height: 100%;
    display: flex;
    padding: 5px;
    flex-wrap: wrap;
    align-items: center; 
    justify-content: center; 
    text-align: center; 
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: normal;`
      )
      .html(
        (d: any) =>
          `<span style="font-size: ${Math.min(radiusScale(d.data.value) / 4, 14)}px; color: ${shouldUseWhiteText(colorScale(d.data.value)) ? 'white' : 'black'};">${truncateText(d.data.name, 30)}</span>`
      );

    // Update the simulation on tick to reposition nodes and links
    simulation.on('tick', () => {
      // Update link positions
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      // Update group positions for nodes
      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    // Cleanup function to stop the simulation
    return () => {
      simulation.stop();
    };
  }, [parsedData, width, city]);

  return <svg ref={svgRef} />;
};

export default BubbleChart;
