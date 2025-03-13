import shouldUseWhiteText from '@/lib/shouldUseWhiteText';
import truncateText from '@/lib/truncateText';
import { Placeholder, View } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import SaveAsImg from '../SaveAsImg';
import { TooltipState } from './types';

interface DataItem {
  name: string;
  parent: string | null | undefined;
  value?: number | undefined;
  color?: string;
}

// Define the props of the component
interface BubbleChartProps {
  width: number;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  city: string;
  onBubbleClick: (code_parent: string, code_child: string) => Promise<void>;
}

interface CustomNode extends d3.SimulationNodeDatum {
  data: DataItem;
  depth: number;
  height?: number;
  parent?: CustomNode | null;
  children?: CustomNode[];
  value?: number;
  id: string;
  fx?: number | null;
  fy?: number | null;
  x?: number;
  y?: number;
  color?: string;
}

interface CustomHierarchyNode extends d3.HierarchyNode<DataItem> {
  color?: string; // Add optional color property
}

const getLevelBeforeRoot = (node: d3.HierarchyNode<DataItem>) => {
  let current = node;
  // Traverse up until the current node has depth 1
  while (current.depth > 1 && current.parent) {
    current = current.parent;
  }
  return current;
};

// Get the top-level theme node (one level below root)
const getTopLevelTheme = (node: d3.HierarchyNode<DataItem>) => {
  if (node.parent && node.parent.depth === 1) {
    return node.parent.data.name; // Parent is the second-level node
  }
  return node.depth === 1 ? node.data.name : null; // For second-level nodes themselves
};

const useFetchCityData = (city: string) => {
  const [rawData, setRawData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (rawData[city]) return;
      try {
        const downloadResult = await downloadData({
          path: `internal/interview-outputs/city_code=${city}/data.csv`,
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

const useFetchAdditionalLinks = (city: string) => {
  const [rawData, setRawData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (rawData[city]) return;
      try {
        const downloadResult = await downloadData({
          path: `internal/interview-outputs/code-links/city_code=${city}/data.csv`,
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

const parseLinks = (csvString: string) => {
  const nodeMap = new Map();

  d3.csvParse(csvString, (d) => {
    if (!d.code_1 || !d.links) return null;
    const levels = (d.code_2 || '').split('>').map((l) => l.trim());
    let parentName = d.links;

    levels.forEach((level, i) => {
      const nodeName = level;
      if (!nodeMap.has(nodeName))
        nodeMap.set(nodeName, {
          name: nodeName,
          parent: parentName,
          value: +d['count(links)'] || 1,
        });
      if (i === levels.length - 1)
        nodeMap.get(nodeName).value += +d['count(links)'] || 1;
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
  setIsDrawerOpen,
  city,
  onBubbleClick,
}) => {
  const [parsedData, setParsedData] = useState<DataItem[]>([]);
  const [linkData, setLinkData] = useState<DataItem[]>([]);
  const rawData = useFetchCityData(city);
  const rawLinkData = useFetchAdditionalLinks(city);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Check if rawData is not null before parsing
    if (rawData) {
      const result = parseCSVData(rawData);
      setParsedData(result);
    }

    if (rawLinkData) {
      const result = parseLinks(rawLinkData);
      setLinkData(result);
    }
  }, [rawData, rawLinkData]);

  useEffect(() => {
    if (!parsedData || !width) return;
    const height = width;
    const allData = parsedData;
    const maxNodes = 50;
    const syntheticRoot = { name: 'Root', parent: null };
    const combinedData = [syntheticRoot, ...allData];

    const stratify = d3
      .stratify<DataItem>()
      .id((d) => d.name)
      .parentId((d) => d.parent);
    const root = stratify(combinedData);

    root.sum((d) => d.value ?? 0);

    let nodes = root.descendants().slice(1); // Exclude the synthetic root node
    // Create a Set of remaining node IDs for easy lookup
    const nodeNames = new Set(nodes.map((node) => node.data.name));

    // Filter links to include only those where both source and target are in the remaining nodes
    let links = root
      .links()
      .filter(
        (link) =>
          nodeNames.has(link.source.data.name) &&
          nodeNames.has(link.target.data.name)
      )
      .map((link) => ({ ...link, value: link.target.value ?? 1 }));

    linkData.forEach(({ name, parent, value }) => {
      const existingLink = links.find(
        (link) =>
          (link.source.id === parent && link.target.id === name) ||
          (link.source.id === name && link.target.id === parent)
      );
      if (existingLink) {
        existingLink.value = value ?? 0; // Update value if link exists
      } else {
        // Add new link if it doesn't exist
        const sourceNode = nodes.find((node) => node.data.name === name);
        const targetNode = nodes.find((node) => node.data.name === parent);
        if (sourceNode && targetNode) {
          links.push({
            source: sourceNode,
            target: targetNode,
            value: value || 1,
          });
        }
      }
    });

    const linkedNodeNames = new Set(
      links.flatMap((link) => [link.source.data.name, link.target.data.name])
    );

    nodes = nodes
      // Sort nodes with linked nodes prioritized, then by value
      .sort((a, b) => {
        const isALinked = linkedNodeNames.has(a.data.name) ? 1 : 0;
        const isBLinked = linkedNodeNames.has(b.data.name) ? 1 : 0;
        if (isALinked !== isBLinked) {
          return isBLinked - isALinked; // Linked nodes come first
        }
        return (b.value ?? 0) - (a.value ?? 0); // Sort by value for nodes within the same group
      })
      .slice(0, maxNodes);

    //Update the nodeNames Set to reflect only the final set of nodes
    const finalNodeNames = new Set(nodes.map((node) => node.data.name));

    //Final link filtering to ensure links only include final nodes
    links = links.filter(
      (link) =>
        finalNodeNames.has(link.source.data.name) &&
        finalNodeNames.has(link.target.data.name)
    );

    const minValue = 0;
    const maxValue = d3.max(nodes, (d) => d.value || 1) || 1;

    const themeColorScales = {
      ' Post Pandemic Work Ecosystems': d3.scaleSequential(d3.interpolateBlues),
      'Transition from education to work': d3.scaleSequential(
        d3.interpolateReds
      ),
      'Future of Work in Cities': d3.scaleSequential(d3.interpolateGreens),
      'An ideal organization': d3.scaleSequential(d3.interpolatePurples),
      'post pandemic work ecosystems': d3.scaleSequential(d3.interpolateBlues),
      'transition from education to work': d3.scaleSequential(
        d3.interpolateReds
      ),
      'future of work in cities': d3.scaleSequential(d3.interpolateGreens),
      'an ideal organization': d3.scaleSequential(d3.interpolatePurples),
    } as const;

    type ThemeKey = keyof typeof themeColorScales;

    nodes.forEach((node: CustomHierarchyNode) => {
      const topLevelTheme = getTopLevelTheme(node) as ThemeKey;
      const colorScale =
        themeColorScales[topLevelTheme] ??
        d3.scaleSequential(d3.interpolateBlues);
      if (colorScale) {
        colorScale.domain([minValue, maxValue]); // Adjust domain per theme if needed
        node.color = colorScale(node.value || 1); // Assign a color based on node value
      }
    });

    // Define radius scale based on the frequency
    const radiusScale = d3
      .scaleSqrt()
      .domain([minValue, maxValue])
      .range([width / 40, width / 8]);

    // Create the simulation for the force-directed graph
    const simulation = d3
      .forceSimulation(nodes as CustomNode[])
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => (d as CustomNode).id)
          .distance((link) => Math.sqrt(link.value))
      ) // Variable link distance
      .force('charge', d3.forceManyBody().strength(40))
      .force('center', d3.forceCenter(width / 2, height / 2)) // Center the graph
      .force(
        'collision',
        d3
          .forceCollide()
          .radius((d) => radiusScale((d as CustomNode).value ?? 0) + 10)
          .strength(0.6)
      )
      .force(
        'attraction',
        d3
          .forceRadial(
            (d) =>
              radiusScale((d as CustomNode).value ?? 0) +
              ((d as CustomNode).depth || 1), // Position by depth level
            width / 2,
            height / 2
          )
          .strength(0.9) // Increased strength to pull nodes to their radial positions
      )
      .alphaDecay(0.06)
      .alpha(0.1);

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
      .attr('opacity', 0.5)
      .attr('stroke-width', (d) => Math.sqrt(d.value) ?? 1);

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
        setTooltipState({ ...tooltipState, position: null });
        const levelBeforeRoot = getLevelBeforeRoot(d).id ?? '';
        if (d.depth > 2) {
          onBubbleClick(levelBeforeRoot, d.data.name);
        } else onBubbleClick(d.data.parent ?? '', d.data.name);
      });

    const drag = d3
      .drag<SVGElement, d3.HierarchyNode<DataItem>>()
      .on(
        'start',
        (
          event: d3.D3DragEvent<
            SVGCircleElement,
            d3.HierarchyNode<DataItem>,
            d3.HierarchyNode<DataItem>
          >,
          customNode: d3.HierarchyNode<DataItem>
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
          event: d3.D3DragEvent<
            SVGCircleElement,
            d3.HierarchyNode<DataItem>,
            d3.HierarchyNode<DataItem>
          >,
          customNode: d3.HierarchyNode<DataItem>
        ) => {
          const nodeCopy = { ...customNode, fx: event.x, fy: event.y };
          Object.assign(customNode, nodeCopy);
        }
      )
      .on(
        'end',
        (
          event: d3.D3DragEvent<
            SVGCircleElement,
            d3.HierarchyNode<DataItem>,
            d3.HierarchyNode<DataItem>
          >,
          customNode: d3.HierarchyNode<DataItem>
        ) => {
          if (!event.active) simulation.alphaTarget(0);
          const nodeCopy = { ...customNode, fx: null, fy: null };
          Object.assign(customNode, nodeCopy);
        }
      );

    (
      node as d3.Selection<
        SVGElement,
        d3.HierarchyNode<DataItem>,
        SVGSVGElement,
        unknown
      >
    ).call(drag);

    // Add nodes (bubbles) as circles
    node
      .append('circle')
      .attr('r', (d) => radiusScale(d.value ?? 0))
      .attr('fill', (d: CustomHierarchyNode) => d.color ?? 'grey')
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
    flex-wrap: wrap;
    align-items: center; 
    justify-content: center; 
    text-align: center; 
    overflow-wrap: anywhere;
    font-family: Gotham Narrow Book, Arial, sans-serif;
    white-space: normal;`
      )
      .html(
        (d: CustomHierarchyNode) =>
          `<span style="padding: 5px; font-size: ${Math.min(radiusScale(d.value ?? 0) / 4, 14)}px; color: ${shouldUseWhiteText(d.color ?? 'grey') ? 'white' : 'black'};">${truncateText(d.data.name, 50)}</span>`
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
  }, [parsedData, width, city, linkData]);

  return (
    <View>
      {!rawData || !parsedData || !width || !linkData ? (
        <Placeholder isLoaded={false} width='100%' minHeight='800px' />
      ) : (
        <View minHeight={width || '800px'}>
          <svg ref={svgRef} />
          <SaveAsImg svgRef={svgRef} />
        </View>
      )}
    </View>
  );
};

export default BubbleChart;
