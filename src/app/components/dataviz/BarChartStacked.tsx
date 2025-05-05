import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import SaveAsImg from './SaveAsImg';

const colors = [
  '#F2695D',
  '#FBD166',
  '#2f4eac',
  '#B8D98D',
  '#F6D9D7',
  '#af6860',
];

interface FlexibleDataItem {
  [key: string]: number | string;
}

interface TooltipState {
  position: { x: number; y: number } | null;
  content?: string;
  group?: string;
}

interface BarChartProps {
  width: number;
  data: FlexibleDataItem[];
  keys: string[];
  surplusKey: string;
  labelAccessor: (d: FlexibleDataItem) => string;
  tooltipFormatter?: (d: FlexibleDataItem) => string;
  tooltipState: TooltipState;
  filterLabel?: string | null;
  xLabel?: string;
  mode?: 'percent' | 'absolute';
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  onBarClick?: (label: string) => void;
  children?: React.ReactNode;
  marginLeft?: number;
  height?: number;
}

const BarChartStacked: React.FC<BarChartProps> = ({
  height = 800,
  width = 600,
  setTooltipState,
  data,
  keys,
  labelAccessor,
  surplusKey,
  marginLeft,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const duration = 1000;
  const margin = {
    left: marginLeft ?? 60,
    right: 20,
    top: 20,
    bottom: 100,
  };

  useEffect(() => {
    if (!ref.current || !data || !width || !height) return;

    const svg = d3.select(ref.current);

    svg.selectAll('*').remove();

    const color = d3.scaleOrdinal<string>().domain(keys).range(colors);

    const stackGenerator = d3
      .stack<{ [key: string]: number | string }>()
      .keys(keys)
      .offset(d3.stackOffsetDiverging);

    const xDomainMin = d3.min(data, (d) =>
      d3.sum(keys, (key) => Number(d[key]) || 0)
    )!;

    const xDomainMax = d3.max(data, (d) =>
      d[surplusKey] ? Number(d[surplusKey]) : 0
    )!;

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => labelAccessor(d)))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    const xScale = d3
      .scaleLinear()
      .domain([xDomainMin, xDomainMax])
      .nice()
      .range([margin.left, width - margin.right]);
    const series = stackGenerator(data);

    const groups = svg
      .append('g')
      .selectAll('g')
      .data(series)
      .join('g')
      .attr('fill', (d) => color(d.key));

    groups
      .selectAll('rect')
      .data((d) => d.map((segment) => ({ ...segment, key: d.key })))
      .join('rect')
      .attr('y', (d) => yScale(labelAccessor(d.data))!)
      .attr('x', xScale(0))
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        const { key } = d;
        const value = d[1] - d[0];
        setTooltipState({
          position: { x, y },
          content: `${labelAccessor(d.data)} ${key}: $${value.toFixed(2)}`,
        });
      })
      .on('mousemove', (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        const { key } = d;
        const value = d[1] - d[0];
        setTooltipState({
          position: { x, y },
          content: `${labelAccessor(d.data)} ${key}: $${value.toFixed(2)}`,
        });
      })
      .on('mouseout', () => {
        setTooltipState({ position: null });
      })
      .on('mouseout', () => {
        setTooltipState(() => ({ position: null }));
      })
      .transition()
      .duration(duration)
      .attr('x', (d) => xScale(Math.min(d[0], d[1])))
      .attr('width', (d) => Math.abs(xScale(d[1]) - xScale(d[0])));

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${margin.top})`)
      .call(
        d3.axisTop(xScale).tickFormat((d) => `$${d3.format(',')(d as number)}`)
      )
      .selectAll('text')
      .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
      .attr('font-weight', '400')
      .style('fill', 'white');

    const yAxis = svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    yAxis
      .selectAll('text')
      .attr('text-anchor', 'end') // Align text properly
      .attr('transform', 'rotate(-30)')
      .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
      .attr('font-weight', '400')
      .style('fill', 'white');

    yAxis.selectAll('.domain').remove();
    yAxis.selectAll('.tick line').remove();

    // Find pixel position of 0
    const zeroX = xScale(0);

    svg
      .append('line')
      .attr('x1', zeroX)
      .attr('x2', zeroX)
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,2');

    // Create a group for labels
    const labelsGroup = svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom / 2})`);

    // Expenses label
    labelsGroup
      .append('text')
      .attr('x', zeroX - 10) // 50px left of 0
      .attr('y', 0)
      .attr('text-anchor', 'end') // Right-align text
      .attr('fill', 'white')
      .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
      .attr('font-size', 12)
      .text('← Expenses');

    // Surplus label
    labelsGroup
      .append('text')
      .attr('x', zeroX + 10) // 50px right of 0
      .attr('y', 0)
      .attr('text-anchor', 'start') // Left-align text
      .attr('fill', 'white')
      .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
      .attr('font-size', 12)
      .text('Surplus →');
  }, [data, width, height, keys]);

  return (
    <>
      <svg ref={ref} width={width} height={height} />
      {width > 0 && <SaveAsImg svgRef={ref} />}
    </>
  );
};

export default BarChartStacked;
