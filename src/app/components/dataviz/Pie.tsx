import { Heading, View } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import Legend from './Legend';
import Tooltip from './TooltipChart';

interface DataItem {
  [key: string]: string | number;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

type PieArcDatum<T> = d3.PieArcDatum<T>;

const PieChartComponent: React.FC<{
  width?: number;
  height?: number;
  type: string;
  cluster?: string;
  title?: string;
}> = ({ width = 600, height = 400, type, cluster = 'all', title }) => {
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<Record<string, DataItem[]>>({});
  const [activeFile, setActiveFile] = useState(`${type}-${cluster}.csv`);
  const [loading, setLoading] = useState(false);
  const [tooltipState, setTooltipState] = useState<{
    position: { x: number; y: number } | null;
    content: string;
  }>({
    position: null,
    content: '',
  });
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);

  useEffect(() => {
    setActiveFile(`${type}-${cluster}.csv`);
  }, [cluster, type]);

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
    d3.select(`#pie-chart-${type}`).selectAll('svg').remove();

    const getColor = (value: string): string => {
      // Use d3.scaleOrdinal to create a color scale based on d3.schemeCategory10
      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(data.map((d) => d[Object.keys(d)[0]] as string)) // Use all unique values from data
        .range(d3.schemeCategory10);

      // Return color based on value
      return colorScale(value);
    };

    const sortedData = [...data].sort(
      (a, b) => (b.Count as number) - (a.Count as number)
    );

    const newLegendData = sortedData.map((d, index) => ({
      key: d[Object.keys(d)[0]] as string,
      color: getColor(d[Object.keys(d)[0]] as string),
    }));
    setLegendData(newLegendData);

    const svg = d3
      .select(`#pie-chart-${type}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const radius = Math.min(width, height) / 2;
    const pie = d3.pie<DataItem>().value((d) => d.Count as number);

    const arcGenerator = d3
      .arc<PieArcDatum<DataItem>>()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg
      .selectAll<SVGGElement, PieArcDatum<DataItem>>('g.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    arcs
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d, i) =>
        getColor(d.data[Object.keys(d.data)[0]] as string)
      );

    arcs
      .selectAll<SVGPathElement, PieArcDatum<DataItem>>('path')
      .transition()
      .duration(1000) // Transition duration in milliseconds
      .attr('fill', (d, i) =>
        getColor(d.data[Object.keys(d.data)[0]] as string)
      )
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arcGenerator(interpolate(t))!;
        };
      });

    arcs
      .selectAll<SVGPathElement, PieArcDatum<DataItem>>('path')
      .on('mouseover', (event, d) => {
        const xPos = event.layerX;
        const yPos = event.layerY;
        const category = Object.keys(d.data)[0];
        setTooltipState({
          position: { x: xPos, y: yPos },
          content: `${d.data[category]}: ${d.data.Count}`,
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
  }, [parsedData, width, height, activeFile]);

  return (
    <View>
      <Heading
        level={4}
        color='font.inverse'
        textAlign='center'
        marginBottom='large'
      >
        {title || type}
      </Heading>
      <div id={`pie-chart-${type}`}></div>
      <Legend data={legendData} />
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
