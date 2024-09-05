import { Flex, Heading } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import Legend from './Legend';

interface DataItem {
  [key: string]: string | number;
}

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  child?: ReactNode | null;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

interface PieChartProps {
  width?: number;
  height?: number;
  type: string;
  cluster?: string;
  title?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  containerRef: React.RefObject<HTMLDivElement>;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
}

type PieArcDatum<T> = d3.PieArcDatum<T>;

const StyledHeading = styled(Heading)``;

const ChartContainer = styled(Flex)`
  overflow: visible;
`;

const PieChartComponent: React.FC<PieChartProps> = ({
  width = 600,
  height = 400,
  type,
  cluster = 'all',
  title,
  margin = { top: 20, right: 40, bottom: 20, left: 40 },
  containerRef,
  tooltipState,
  setTooltipState,
}) => {
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<Record<string, DataItem[]>>({});
  const [activeFile, setActiveFile] = useState(`${type}-${cluster}.csv`);
  const [loading, setLoading] = useState(false);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);

  useEffect(() => {
    setActiveFile(`${type}-${cluster}.csv`);
  }, [cluster, type]);

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

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = width - margin.left - margin.right;
    const radius = Math.min(chartWidth, chartHeight) / 2;
    const pie = d3.pie<DataItem>().value((d) => d.Count as number);

    const svg = d3
      .select(`#pie-chart-${type}`)
      .append('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight);

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
      .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`);

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
      .attrTween('d', (d) => {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => {
          return arcGenerator(interpolate(t))!;
        };
      });

    arcs
      .selectAll<SVGPathElement, PieArcDatum<DataItem>>('path')
      .on('mouseover', (event, d) => {
        const xPos = event.clientX;
        const yPos = event.clientY + window.scrollY;
        console.log(yPos);
        const category = Object.keys(d.data)[0];
        setTooltipState({
          position: { x: xPos, y: yPos },
          content: `${d.data[category]}: ${d.data.Count}`,
        });
      })
      .on('mousemove', (event) => {
        const xPos = event.clientX;
        const yPos = event.clientY + window.scrollY;
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
    <>
      <Flex direction='column' ref={containerRef}>
        <StyledHeading
          level={4}
          color='font.inverse'
          textAlign='center'
          marginBottom='large'
        >
          {title || type}
        </StyledHeading>
        <div id={`pie-chart-${type}`}></div>
        <Legend data={legendData} />
      </Flex>
    </>
  );
};

export default PieChartComponent;
