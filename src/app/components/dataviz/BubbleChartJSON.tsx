// @ts-nocheck

import * as d3 from 'd3';
import React, { ReactNode, useEffect, useRef } from 'react';

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
  nodes: Array<{
    id: string;
    quotes: string[];
    value: number;
  }>;
  links: Array<{
    id: string;
    source: string;
    target: string;
    value: number;
  }>;
}

// Define the props of the component
interface BubbleChartProps {
  width: number;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setQuotes: React.Dispatch<React.SetStateAction<string[]>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  data?: DataItem[];
}

interface CustomNode extends d3.SimulationNodeDatum {
  id: string;
  quotes: string[];
  depth?: number | null;
  value?: number | null;
  fx?: number | null;
  fy?: number | null;
}

interface CustomDataNode extends d3.HierarchyNode<DataItem> {
  id: string;
  quotes: string[];
  value: number;
}

interface CustomLink extends d3.SimulationLinkDatum<CustomNode> {
  id: string;
  source: string | CustomNode; // Can be a node ID or a node object
  target: string | CustomNode; // Can be a node ID or a node object
  value: number;
}

//helper functions
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
  setIsDrawerOpen,
  data,
  setQuotes,
  setCode,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !width) return;
    const { nodes, links } = data;
    const height = width;
    const margin = width * 0.01;
    const updatedWidth = width - margin * 2;

    const minValue = 0;
    const maxValue = d3.max(nodes, (d) => d.value || 1) || 1;

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues) // Choose a color interpolation
      .domain([minValue, maxValue]);

    // Define radius scale based on the frequency
    const radiusScale = d3
      .scaleSqrt()
      .domain([minValue, maxValue])
      .range([updatedWidth / 50, updatedWidth / 10]);

    // Create the simulation for the force-directed graph
    const simulation = d3
      .forceSimulation<CustomNode>(nodes as CustomNode[])
      .force(
        'link',
        d3
          .forceLink<CustomNode, CustomLink>(links)
          .id((d) => d.id)
          .distance((link) => Math.sqrt(link.value))
      ) // Variable link distance
      .force('charge', d3.forceManyBody().strength(40))
      .force('center', d3.forceCenter(updatedWidth / 2, height / 2)) // Center the graph
      .force(
        'collision',
        d3
          .forceCollide<CustomNode>()
          .radius((d) => radiusScale(d.value ?? 0) + 10)
          .strength(0.8)
      )
      .force(
        'attraction',
        d3
          .forceRadial<CustomNode>(
            (d) => radiusScale(d.value ?? 0) + (d.depth || 1), // Position by depth level
            updatedWidth / 2,
            height / 2
          )
          .strength(0.2) // Increased strength to pull nodes to their radial positions
      )
      .alphaDecay(0.01)
      .alpha(0.3);

    // Select the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr('width', updatedWidth)
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
      .attr('stroke-width', (d) => Math.sqrt(d.value) ?? 1);

    const node = svg
      .selectAll('g') // Change to group elements to contain both circle and text
      .data(nodes as CustomDataNode[])
      .join('g') // Create a group for each node
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState({
          position: { x: xPos, y: yPos },
          content: d.id,
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
        setQuotes(d.quotes);
        setIsDrawerOpen(true);
        setCode(d.id);
      });

    const drag = d3
      .drag<SVGElement, CustomDataNode>()
      .on(
        'start',
        (
          event: d3.D3DragEvent<SVGElement, CustomDataNode, SVGSVGElement>,
          customNode: CustomDataNode
        ) => {
          if (!event.active) simulation.alphaTarget(0.1).restart();
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
          event: d3.D3DragEvent<SVGElement, CustomDataNode, SVGSVGElement>,
          customNode: CustomDataNode
        ) => {
          const nodeCopy = { ...customNode, fx: event.x, fy: event.y };
          Object.assign(customNode, nodeCopy);
        }
      )
      .on(
        'end',
        (
          event: d3.D3DragEvent<SVGElement, CustomDataNode, SVGSVGElement>,
          customNode: CustomDataNode
        ) => {
          if (!event.active) simulation.alphaTarget(0);
          const nodeCopy = { ...customNode, fx: null, fy: null };
          Object.assign(customNode, nodeCopy);
        }
      );

    node.call(drag);

    // Add nodes (bubbles) as circles
    node
      .append('circle')
      .attr('r', (d) => radiusScale(d.value ?? 0))
      .attr('fill', (d) => colorScale(d.value ?? 0))
      .attr('stroke-width', 1.5);

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
          `<span style="font-size: ${Math.min(radiusScale(d.value ?? 0) / 4, 14)}px; color: ${shouldUseWhiteText(colorScale(d.value ?? 0)) ? 'white' : 'black'};">${truncateText(d.id, 100)}</span>`
      );

    // Update the simulation on tick to reposition nodes and links
    simulation.on('tick', () => {
      // Update link positions
      link
        .attr('x1', (d) => d.source?.x ?? 0)
        .attr('y1', (d) => d.source?.y ?? 0)
        .attr('x2', (d) => d.target?.x ?? 0)
        .attr('y2', (d) => d.target?.y ?? 0);
      node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
      // Update group positions for nodes
      node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    });

    // Cleanup function to stop the simulation
    return () => {
      simulation.stop();
    };
  }, [data, width]);

  return <svg ref={svgRef} />;
};

export default BubbleChart;
