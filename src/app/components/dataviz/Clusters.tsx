import { Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import Pie from './Pie';
import Tooltip from './TooltipChart';

interface DataItem {
  [key: string]: string | number;
}

const clusterNames = [
  'Social good focus',
  'Forming opinions',
  'Affordability focus',
];

const clusterMap: {
  'Social good focus': string;
  'Forming opinions': string;
  'Affordability focus': string;
  All: string;
  [key: string]: string; // Index signature
} = {
  'Social good focus': 'social',
  'Forming opinions': 'forming',
  'Affordability focus': 'affordability',
  All: 'all',
};

// Function to get key from value
const getKeyFromValue = (value: string): string | null => {
  for (const key in clusterMap) {
    if (clusterMap[key] === value) {
      return key;
    }
  }
  return null; // Return null if value is not found
};

const Clusters = ({ width = 800 }) => {
  const height = 600;
  const [loading, setLoading] = useState(false);
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
  const [currentCluster, setCurrentCluster] = useState('all');

  useEffect(() => {
    const fetchData = async (filename: string) => {
      if (rawData.hasOwnProperty(filename)) return;

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
          row[newKey] = isNaN(+d[oldKey]) ? d[newKey] : +d[oldKey];
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
          } else return 0.2;
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

      const legendData = colorScale.domain();

      const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr(
          'transform',
          `translate(${width - 150 - 20}, ${height - legendData.length * 20 - 50})`
        );

      // Legend background
      // legend
      //   .append('rect')
      //   .attr('x', -10)
      //   .attr('y', -10)
      //   .attr('rx', 8)
      //   .attr('ry', 8)
      //   .attr('width', 170)
      //   .attr('height', legendData.length * 20 + 10)
      //   .style('fill', 'white')
      //   .attr('opacity', 0.9);

      // Legend items
      legend
        .selectAll('rect.legend-item')
        .data(legendData)
        .enter()
        .append('rect')
        .attr('class', 'legend-item')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 10)
        .attr('height', 10)

        .attr('fill', (d) => colorScale(d));

      legend
        .selectAll('text.legend-label')
        .data(legendData)
        .enter()
        .append('text')
        .attr('class', 'legend-label')
        .attr('x', 20)
        .attr('y', (d, i) => i * 20 + 9)
        .style('fill', 'white')
        .text((d) => d);

      // Add axes (if needed)
      // const xAxis = d3.axisBottom(xScale);
      // svg
      //   .append('g')
      //   .attr('transform', `translate(0, ${height - 50})`)
      //   .call(xAxis);

      // const yAxis = d3.axisLeft(yScale);
      // svg.append('g').attr('transform', 'translate(50, 0)').call(yAxis);

      // Add title
      // svg
      //   .append('text')
      //   .attr('x', width / 2)
      //   .attr('y', 30)
      //   .attr('text-anchor', 'middle')
      //   .style('font-size', '16px')
      //   .text('Scatterplot with UMAP1 and UMAP2');
    }
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
      <div id='chart'></div>
      {tooltipState.position && (
        <Tooltip
          x={tooltipState.position.x - 40}
          content={tooltipState.content}
          y={tooltipState.position.y}
        />
      )}
      <Text marginBottom='xl'>
        Click on a data point to see the demographic breakdown of that cluster.
        Current cluster: {getKeyFromValue(currentCluster)}
      </Text>
      <Flex wrap='wrap' justifyContent='space-between'>
        <Pie
          width={width >= 700 ? width / 2 - 20 : width}
          type='gender'
          title='Gender'
          cluster={currentCluster}
        />
        <Pie
          width={width >= 700 ? width / 2 - 20 : width}
          type='status'
          title='Citizenship Status'
          cluster={currentCluster}
        />
        <Pie
          width={width >= 700 ? width / 2 - 20 : width}
          type='disability'
          cluster={currentCluster}
          title='Ability'
        />
      </Flex>
    </View>
  );
};

export default Clusters;
