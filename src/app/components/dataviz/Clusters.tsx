'use client';

import { useDimensions } from '@/hooks/useDimensions';
import {
  Flex,
  Heading,
  Placeholder,
  Text,
  View,
  useTheme,
} from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FaBrain, FaMoneyBill } from 'react-icons/fa6';
import styled from 'styled-components';
import Heatmap from './Heatmap';
import Legend from './Legend';
import Tooltip from './TooltipChart';

interface DataItem {
  [key: string]: string | number;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

interface ClusterProps {
  currentCluster: string;
  setCurrentCluster: (cluster: string) => void;
  getKeyFromValue: (value: string) => string | null;
  clusterMap: {
    [key: string]: string;
    'Social good focus': string;
    'Forming opinions': string;
    'Affordability focus': string;
    All: string;
  };
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const ChartContainer = styled.div`
  position: relative;
`;

const OverflowContainer = styled(View)`
  overflow: visible;
`;

const clusterNames = [
  'Social good focus',
  'Forming opinions',
  'Affordability focus',
];

const Clusters: React.FC<ClusterProps> = ({
  currentCluster,
  setCurrentCluster,
  getKeyFromValue,
  clusterMap,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const height = 600;
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<Record<string, DataItem[]>>({});
  const [activeFile, setActiveFile] = useState('umap_data.csv');
  const [tooltipState, setTooltipState] = useState<{
    position: { x: number; y: number } | null;
    content: string;
    group: string;
  }>({
    position: null,
    content: '',
    group: '',
  });
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const { tokens } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useDimensions(containerRef);
  const width = containerWidth - 60;

  useEffect(() => {
    const fetchData = async (filename: string) => {
      if (Object.prototype.hasOwnProperty.call(rawData, filename)) return;

      try {
        setLoading(true);
        const downloadResult = await downloadData({
          path: `public/${filename}`,
        }).result;
        const text = await downloadResult.body.text();
        setRawData({ ...rawData, [filename]: text });
        setLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setLoading(false);
      }
    };

    const parseDynamicCSVData = (filename: string, csvString: string) => {
      if (parsedData[filename]) return;

      const parsed = d3.csvParse(csvString, (d) => {
        const row: DataItem = {};
        Object.keys(d).forEach((oldKey) => {
          const parts = oldKey.split(/DEM_|\(SUM\)/);
          const newKey = parts.length > 1 ? parts[1] : oldKey;
          row[newKey] = Number.isNaN(+d[oldKey]) ? d[newKey] : +d[oldKey];
        });
        return row;
      });

      setParsedData({ ...parsedData, [filename]: parsed });
    };

    fetchData(activeFile);
    if (rawData[activeFile])
      parseDynamicCSVData(activeFile, rawData[activeFile]);
  }, [activeFile, rawData, parsedData]);

  useEffect(() => {
    if (!width || !height || !parsedData[activeFile]) return;

    if (parsedData[activeFile]) {
      const data = parsedData[activeFile];

      d3.select('#chart').selectAll('svg').remove();
      // Create SVG element
      const svg = d3
        .select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Filter out undefined or non-numeric values for UMAP1 and UMAP2
      const filteredData = data.filter(
        (d) => typeof d.UMAP1 === 'number' && typeof d.UMAP2 === 'number'
      );

      // Compute domain for xScale and yScale
      const xMin = d3.min(filteredData, (d) => +d.UMAP1) as number; // Convert to number using +
      const xMax = d3.max(filteredData, (d) => +d.UMAP1) as number; // Convert to number using +

      const yMin = d3.min(filteredData, (d) => +d.UMAP2) as number; // Convert to number using +
      const yMax = d3.max(filteredData, (d) => +d.UMAP2) as number; // Convert to number using +

      // Create scales
      const xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([50, width - 50]);

      const yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - 50, 50]);

      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(clusterNames)
        .range(['steelblue', 'orange', 'green']);

      // Add contour density layer
      const densityData = d3
        .contourDensity<DataItem>()
        .x((d: DataItem) => xScale(d.UMAP1 as number))
        .y((d: DataItem) => yScale(d.UMAP2 as number))
        .size([width, height])
        .bandwidth(35)(filteredData);

      svg
        .append('g')
        .selectAll('path')
        .data(densityData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-linejoin', 'round');

      // Create circles for each data point
      svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.UMAP1 as number))
        .attr('cy', (d) => yScale(d.UMAP2 as number))
        .attr('r', 5)
        .attr('fill', (d) => colorScale(String(d.Cluster_Label)))
        .attr('opacity', (d) => {
          if (currentCluster === 'all') {
            return 0.9;
          }
          if (d.Cluster_Label === getKeyFromValue(currentCluster)) {
            return 0.9;
          }
          return 0.2;
        })
        .on('mouseover', (event, d) => {
          d3.select(event.currentTarget).classed('hover-cursor', true);
          const xPos = event.layerX;
          const yPos = event.layerY;
          setTooltipState({
            position: { x: xPos, y: yPos },
            content: `Cluster: ${d.Cluster_Label}`,
            group: '',
          });
        })
        .on('mousemove', (event) => {
          const xPos = event.layerX;
          const yPos = event.layerY;
          setTooltipState((prevTooltipState) => ({
            ...prevTooltipState,
            position: { x: xPos, y: yPos },
          }));
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget).classed('hover-cursor', false);
          setTooltipState({ ...tooltipState, position: null });
        })
        .on('click', (event, d) => {
          event.stopPropagation();
          if (currentCluster === clusterMap[d.Cluster_Label]) {
            setCurrentCluster('all'); // Reset to 'all'
            setIsDrawerOpen(!isDrawerOpen);
          } else {
            setCurrentCluster(clusterMap[d.Cluster_Label]); // Set currentCluster to clicked Cluster_Label
            setIsDrawerOpen(true);
          }
        });

      svg.on('click', () => {
        setCurrentCluster('all'); // Reset to 'all' when clicking on SVG background
      });

      const customLegendData = colorScale.domain();

      const newLegendData = customLegendData.map((item, index) => ({
        key: item,
        color: colorScale(item),
      }));
      setLegendData(newLegendData);
    }
  }, [parsedData, activeFile, width, currentCluster]);

  return (
    <OverflowContainer padding='xl' ref={containerRef}>
      <Heading level={1} marginBottom='xl'>
        Psychographic clusters
      </Heading>
      <Text>
        Survey participants were asked to rank the topics of affordability,
        education and skills devopment, equity, diversity and inclusion,
        Indigenous culture, truth and reconciliation, entrepreneurial spirit,
        local economic growth, digital transformation, transportation, mental
        health, and climate change in terms of importance. Then, they were asked
        to rank how thier cities were performing in each of these categories.
        Based on the relationships between these importance/performance
        rankings, three distinct groups emerge. Clusters are generated using the
        UMAP method. Click on a data point to see the demographic breakdown of
        that cluster.
      </Text>
      <ChartContainer>
        <Placeholder height={height} isLoaded={!loading || false} />
        <div id='chart'></div>
        <Legend data={legendData} position='absolute' />
        {tooltipState.position && (
          <Tooltip
            x={tooltipState.position.x - 100}
            content={tooltipState.content}
            y={tooltipState.position.y + 20}
          />
        )}
      </ChartContainer>
      <Heading level={4} color='primary.60'>
        Key Takeaways
      </Heading>
      <Flex alignItems='center' justifyContent='flex-start'>
        <FaMoneyBill size='100px' color={tokens.colors.primary[60].value} />
        <Text marginBottom='0'>
          Regardless of cluster, all youth agree that
          <strong> affordability</strong> is the top priority issue to improve
          Canadian city performance nationwide.
        </Text>
      </Flex>
      <Flex alignItems='center' justifyContent='flex-start'>
        <FaBrain size='100px' color={tokens.colors.primary[60].value} />
        <Text>
          Regardless of cluster, all youth agree that
          <strong> mental health</strong> and <strong> good youth jobs </strong>
          are high priority issues to improve Canadian city performance
          nationwide.
        </Text>
      </Flex>
      <Heatmap
        activeFile='cluster-heatmap-economic.csv'
        width={width}
        height={height}
      />
      <Heatmap
        activeFile='cluster-heatmap-forming.csv'
        width={width}
        height={height}
      />
      <Heatmap
        activeFile='cluster-heatmap-social.csv'
        width={width}
        height={height}
      />
    </OverflowContainer>
  );
};

export default Clusters;
