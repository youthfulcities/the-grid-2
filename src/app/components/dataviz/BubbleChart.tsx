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

interface DataItem {
  name: string;
  parent: string | null | undefined;
  value?: number | undefined;
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

interface CustomNode extends d3.SimulationNodeDatum {
  data: DataItem; // The actual data for this node
  depth: number; // Depth in the hierarchy
  height?: number; // Optional height in the hierarchy
  parent?: CustomNode | null; // Reference to the parent node
  children?: CustomNode[]; // Array of child nodes
  value?: number; // Optional value, if applicable
  id: string; // Unique identifier for the node
  fx?: number | null; // Fixed x position
  fy?: number | null; // Fixed y position
  x?: number; // Current x position
  y?: number; // Current y position
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

const useFetchCityData = (city: string) => {
  const [rawData, setRawData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (rawData[city]) return;
      try {
        const downloadResult = await downloadData({
          path: `internal/doc_city=${city}/data.csv`,
        }).result;
        const text = await downloadResult.body.text();
        setRawData((prevData) => ({ ...prevData, [city]: text }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [city, rawData]);

  return rawData[city];
};

const parseCSVData = (csvString: string) => {
  const nodeMap = new Map();
  d3.csvParse(csvString, (d) => {
    if (!d.code_1) return null;
    const levels = (d.code_2 || '').split('>').map((l) => l.trim());
    let parentName = d.code_1;
    if (!nodeMap.has(parentName))
      nodeMap.set(parentName, {
        name: parentName,
        parent: 'Root',
        value: +d['count(code_2)'] || 0,
      });

    levels.forEach((level, i) => {
      const nodeName = level;
      if (!nodeMap.has(nodeName))
        nodeMap.set(nodeName, {
          name: nodeName,
          parent: parentName,
          value: +d['count(code_2)'] || 0,
        });
      if (i === levels.length - 1)
        nodeMap.get(nodeName).value += +d['count(code_2)'] || 0;
      parentName = nodeName;
    });
  });
  const parsed = Array.from(nodeMap.values()).filter((node) => node.name);
  return parsed as DataItem[];
};

const BubbleChart: React.FC<BubbleChartProps> = ({
  width,
  tooltipState,
  setTooltipState,
  setCode,
  setIsDrawerOpen,
  city,
}) => {
  const [parsedData, setParsedData] = useState<DataItem[]>([]);
  const rawData = useFetchCityData(city);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Check if rawData is not null before parsing
    if (rawData) {
      const result = parseCSVData(rawData);
      setParsedData(result);
    }
  }, [rawData]);

  useEffect(() => {
    if (!parsedData || !width) return;

    const height = width;
    const allData = parsedData;
    const maxNodes = 40;
    const syntheticRoot = { name: 'Root', parent: null };
    const combinedData = [syntheticRoot, ...allData];

    const stratify = d3
      .stratify<DataItem>()
      .id((d) => d.name)
      .parentId((d) => d.parent);
    const root = stratify(combinedData);
    root.sum((d) => d.value ?? 0);

    // // Flatten nodes and links for the force simulation
    let nodes = root.descendants().slice(1); // Exclude the synthetic root node
    // Sort nodes by value in descending order and limit to maxNodes
    nodes = nodes
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
      .slice(0, maxNodes);
    // Create a Set of remaining node IDs for easy lookup
    const nodeNames = new Set(nodes.map((node) => node.data.name));

    // Filter links to include only those where both source and target are in the remaining nodes
    const links = root
      .links()
      .filter(
        (link) =>
          nodeNames.has(link.source.data.name) &&
          nodeNames.has(link.target.data.name)
      );

    const minValue = 0;
    const maxValue = d3.max(nodes, (d) => d.value || 1) || 1;

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues) // Choose a color interpolation
      .domain([minValue, maxValue]);

    // Define radius scale based on the frequency
    const radiusScale = d3
      .scaleSqrt()
      .domain([minValue, maxValue])
      .range([width / 100, width / 10]);

    // Create the simulation for the force-directed graph
    const simulation = d3
      .forceSimulation(nodes as CustomNode[])
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => (d as CustomNode).id)
          .distance(
            (link) =>
              // Increase distance based on node depth or value
              50 + (link.source.depth || 0) * 20
          )
      ) // Variable link distance
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength((d) => -Math.sqrt(width / 8) * (d as CustomNode).depth || 1) // Charge strength varies with node depth
      )
      .force('center', d3.forceCenter(width / 2, height / 2)) // Center the graph
      .force(
        'collision',
        d3
          .forceCollide()
          .radius((d) => radiusScale((d as CustomNode).value ?? 0) + 10) // Adjusted collision radius for better spacing
      )
      .force(
        'attraction',
        d3
          .forceRadial(
            (d) =>
              radiusScale((d as CustomNode).value ?? 0) +
              ((d as CustomNode).depth || 1) * 40, // Position by depth level
            width / 2,
            height / 2
          )
          .strength(0.3) // Increased strength to pull nodes to their radial positions
      );

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
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
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

    const drag = d3
      .drag<SVGCircleElement, d3.HierarchyNode<DataItem>>()
      .on(
        'start',
        (
          event: d3.D3DragEvent<SVGCircleElement, CustomNode, CustomNode>,
          customNode: d3.HierarchyNode<DataItem>
        ) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          const nodeCopy = {
            ...customNode,
            fx: customNode.x,
            fy: customNode.y,
          };
          Object.assign(node, nodeCopy);
        }
      )
      .on(
        'drag',
        (
          event: d3.D3DragEvent<SVGCircleElement, CustomNode, CustomNode>,
          customNode: d3.HierarchyNode<DataItem>
        ) => {
          const nodeCopy = { ...customNode, fx: event.x, fy: event.y };
          Object.assign(customNode, nodeCopy);
        }
      )
      .on(
        'end',
        (
          event: d3.D3DragEvent<SVGCircleElement, CustomNode, CustomNode>,
          customNode: d3.HierarchyNode<DataItem>
        ) => {
          if (!event.active) simulation.alphaTarget(0);
          const nodeCopy = { ...customNode, fx: null, fy: null };
          Object.assign(customNode, nodeCopy);
        }
      );

    // Add nodes (bubbles) as circles
    node
      .append('circle')
      .attr('r', (d) => radiusScale(d.value ?? 0))
      .attr('fill', (d) => colorScale(d.value ?? 0))
      .attr('stroke-width', 1.5)
      .call(drag);

    node
      .append('foreignObject')
      .attr('width', (d) => radiusScale(d.value ?? 0) * 2)
      .attr('height', (d) => radiusScale(d.value ?? 0) * 2)
      .attr('x', (d) => -radiusScale(d.value ?? 0))
      .attr('y', (d) => -radiusScale(d.value ?? 0))
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
    overflow-wrap: anywhere;
    white-space: normal;`
      )
      .html(
        (d) =>
          `<span style="font-size: ${Math.min(radiusScale(d.value ?? 0) / 4, 14)}px; color: ${shouldUseWhiteText(colorScale(d.value ?? 0)) ? 'white' : 'black'};">${truncateText(d.data.name, 30)}</span>`
      );

    // Update the simulation on tick to reposition nodes and links
    simulation.on('tick', () => {
      // Update link positions
      link
        .attr('x1', (d) => d.source.x ?? 0)
        .attr('y1', (d) => d.source.y ?? 0)
        .attr('x2', (d) => d.target.x ?? 0)
        .attr('y2', (d) => d.target.y ?? 0);
      node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
      // Update group positions for nodes
      node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    });

    // Cleanup function to stop the simulation
    return () => {
      simulation.stop();
    };
  }, [parsedData, width, city]);

  return <svg ref={svgRef} />;
};

export default BubbleChart;
