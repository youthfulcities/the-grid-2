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
}) => {
  const [data, setData] = useState([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data.length > 0) return;
    const fetchData = async (filename: string) => {
      try {
        const downloadResult = await downloadData({
          path: `public/${filename}`,
        }).result;
        const parsedData = JSON.parse(await downloadResult.body.text());
        setData(parsedData);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData('toronto-interview-codes.json');
  }, [width]);

  useEffect(() => {
    const height = width;

    // Create a hierarchical data structure from the flat data
    const root = d3
      .hierarchy<Node>({ code_level_1: 'root', frequency: 0, children: data })
      .sum((d) => d.frequency);

    // Flatten nodes and links for the force simulation
    const nodes = root.descendants().slice(1); // Exclude the synthetic root node
    const links = root
      .links()
      .filter(
        (link) =>
          link.source.depth > 0 &&
          link.target.data &&
          link.target.data.frequency > 0
      );

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues) // Choose a color interpolation
      .domain([0, d3.max(nodes, (d) => d.value || 0) || 1]);

    // Define radius scale based on the frequency
    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(nodes, (d) => d.value || 0) || 1])
      .range([0, width / 10]);

    // Create the simulation for the force-directed graph
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.data.code_level_1)
          .distance(width / 10)
      ) // Link distance
      .force('charge', d3.forceManyBody().strength(-width / 10)) // Adjust charge strength
      .force('center', d3.forceCenter(width / 2, height / 2)) // Center the graph
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => radiusScale(d.value) + 5)
      ) // Prevent overlap
      .force(
        'attraction',
        d3
          .forceRadial(
            (d: any) => radiusScale(d.value) / 2,
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
          content: d.data.code_level_1 || d.data.code_level_2,
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
        setCode(d.data.code_level_1 || d.data.code_level_2);
      }); // Position the group

    // Add nodes (bubbles) as circles
    node
      .append('circle')
      .attr('r', (d: any) => radiusScale(d.value))
      .attr('fill', (d) => colorScale(d.value))
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
      .attr('width', (d: any) => radiusScale(d.value) * 2)
      .attr('height', (d: any) => radiusScale(d.value) * 2)
      .attr('x', (d: any) => -radiusScale(d.value))
      .attr('y', (d: any) => -radiusScale(d.value))
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
          `<span style="font-size: ${Math.min(radiusScale(d.value) / 4, 14)}px; color: ${shouldUseWhiteText(colorScale(d.value)) ? 'white' : 'black'};">${truncateText(d.data.code_level_1 || d.data.code_level_2, 30)}</span>`
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
  }, [data, width]);

  return <svg ref={svgRef} />;
};

export default BubbleChart;
