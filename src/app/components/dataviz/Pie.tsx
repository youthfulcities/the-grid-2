import { Heading, View } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import Tooltip from '../TooltipChart';

interface DataItem {
  [key: string]: string | number;
}

const PieChartComponent: React.FC<{ width?: number; height?: number }> = ({
  width = 600,
  height = 400,
}) => {
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<Record<string, DataItem[]>>({});
  const [activeFile, setActiveFile] = useState('gender-all.csv');
  const [loading, setLoading] = useState(false);
  const [tooltipState, setTooltipState] = useState<{
    position: { x: number; y: number } | null;
    content: string;
  }>({
    position: null,
    content: '',
  });

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
        console.error('Error fetching data:', error);
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

    const data = parsedData[activeFile];
    d3.select('#pie-chart').selectAll('svg').remove();

    const svg = d3
      .select('#pie-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const radius = Math.min(width, height) / 2;
    const pie = d3.pie<DataItem>().value((d) => d.Count as number);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg
      .selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .on('mouseover', (event, d) => {
        const xPos = event.layerX;
        const yPos = event.layerY;
        setTooltipState({
          position: { x: xPos, y: yPos },
          content: `${d.data.Gender_DEM}: ${d.data.Count}`,
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
      });

    const legendData = data.map((d) => d[Object.keys(d)[0]] as string);

    //sort the data without mutating it
    const longestItem = [...legendData].sort((a, b) => b.length - a.length)[0];

    // Add legend
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        `translate(${longestItem.length * 20 - 50}, ${height - legendData.length * 20 - 50})`
      );

    //legend background
    legend
      .append('rect')
      .attr('x', -10)
      .attr('y', -10)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('width', longestItem.length * 9)
      .attr('height', legendData.length * 20 + 10)
      .style('fill', 'white')
      .attr('opacity', 0.9);

    legend
      .selectAll('rect')
      .data(legendData)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => i * 20)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10]);

    legend
      .selectAll('text')
      .data(legendData)
      .enter()
      .append('text')
      .attr('x', 20)
      .attr('y', (d, i) => i * 20 + 9)
      .text((d) => d);
  }, [parsedData, width, height]);

  return (
    <View className='padding'>
      <Heading level={1} marginBottom='xl'>
        Gender Distribution
      </Heading>
      <div id='pie-chart'></div>
      {tooltipState.position && (
        <Tooltip
          x={tooltipState.position.x - 40}
          content={tooltipState.content}
          y={tooltipState.position.y}
        />
      )}
    </View>
  );
};

export default PieChartComponent;
