'use client';

import { Heading, Placeholder, Text, View } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Legend from './Legend';
import Tooltip from './TooltipChart';

interface DataItem {
  [key: string]: string | number;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

interface ClusterProps {
  width: number | undefined;
  currentCluster: string;
  getWidth: (width: number) => number | undefined;
  setCurrentCluster: (cluster: string) => void;
  getKeyFromValue: (value: string) => string | null;
  clusterMap: {
    [key: string]: string;
    'Social good focus': string;
    'Forming opinions': string;
    'Affordability focus': string;
    All: string;
  };
}

const ChartContainer = styled.div`
  position: relative;
`;

const clusterNames = [
  'Social good focus',
  'Forming opinions',
  'Affordability focus',
];

const Clusters: React.FC<ClusterProps> = ({
  width = 800,
  getWidth,
  currentCluster,
  setCurrentCluster,
  getKeyFromValue,
  clusterMap,
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
      // Example D3.js manipulation (you can modify this based on your visualization needs)
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
        .on('mouseout', () => {
          setTooltipState({ ...tooltipState, position: null });
        })
        .on('click', (event, d) => {
          event.stopPropagation();
          if (currentCluster === clusterMap[d.Cluster_Label]) {
            setCurrentCluster('all'); // Reset to 'all'
          } else {
            setCurrentCluster(clusterMap[d.Cluster_Label]); // Set currentCluster to clicked Cluster_Label
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

    getWidth(width);
  }, [parsedData, activeFile, width, currentCluster]);

  return (
    <View className='padding'>
      <Heading level={1} marginBottom='xl'>
        Psychographic clusters
      </Heading>
      <Text>
        These clusters are based on how participants ranked topics in
        importances versus performance of their city. Clusters are generated
        using the UMAP method.
      </Text>
      <ChartContainer>
        <Placeholder height={height} isLoaded={!loading} />
        <div id='chart'></div>
        <Legend data={legendData} position='absolute' />
        {tooltipState.position && (
          <Tooltip
            x={tooltipState.position.x - 200}
            content={tooltipState.content}
            y={tooltipState.position.y}
          />
        )}
      </ChartContainer>
    </View>
  );
};

export default Clusters;
