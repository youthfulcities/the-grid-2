import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Legend from './Legend';
import SaveAsImg from './SaveAsImg';

const colors = ['#FBD166', '#2f4eac', '#F6D9D7', '#B8D98D', '#af6860'];

const ChartContainer = styled.div`
  position: relative;
`;

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
  labelAccessor: (d: FlexibleDataItem) => string;
  tooltipFormatter?: (d: FlexibleDataItem) => string;
  // filterLabel?: string | null;
  // xLabel?: string;
  // mode?: 'percent' | 'absolute';
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  // onBarClick?: (label: string) => void;
  // children?: React.ReactNode;
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
  marginLeft,
  tooltipFormatter,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const duration = 1000;
  const margin = {
    left: marginLeft ?? 60,
    right: 20,
    top: 20,
    bottom: 40,
  };

  const filteredKeys = keys.filter((key) => key !== 'deficit'); // Exclude 'deficit' from the keys
  const legendData = [
    ...filteredKeys // Exclude 'deficit' first
      .map((key, index) => ({
        key,
        color: colors[index] || '#000', // Default color if out of bounds
      })),

    ...(keys.includes('deficit') ? [{ key: 'deficit', color: '#F2695D' }] : []), // Add deficit only if it's in the keys array
  ];

  useEffect(() => {
    if (!ref.current || !data || !width || !height) return;

    const svg = d3.select(ref.current);

    svg.selectAll('*').remove();

    const color = d3.scaleOrdinal<string>().domain(filteredKeys).range(colors);

    const stackGenerator = d3
      .stack<{ [key: string]: number | string }>()
      .keys(keys.filter((key) => key !== 'deficit')) // Exclude 'deficit' from the main stack
      .offset(d3.stackOffsetDiverging);

    const deficitData = data.map((d) => ({
      label: labelAccessor(d),
      value: d.deficit as number,
    }));

    const currentSeries = stackGenerator(data);

    const allValues = currentSeries.flatMap((s) =>
      s.map((d) => [d[0], d[1]]).flat()
    );

    const xDomainMin = Math.min(0, d3.min(allValues)!);
    const xDomainMax = Math.max(0, d3.max(allValues)!);

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
          content: tooltipFormatter
            ? tooltipFormatter(d.data)
            : `${labelAccessor(d.data)} ${key}: $${value.toFixed(2)}`,
        });
      })
      .on('mousemove', (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        const { key } = d;
        const value = d[1] - d[0];
        setTooltipState({
          position: { x, y },
          content: tooltipFormatter
            ? tooltipFormatter(d.data)
            : `${labelAccessor(d.data)} ${key}: $${value.toFixed(2)}`,
        });
      })
      .on('mouseout', () => {
        setTooltipState({ position: null });
      })
      .transition()
      .duration(duration)
      .attr('x', (d) => xScale(Math.min(d[0], d[1])))
      .attr('width', (d) => Math.abs(xScale(d[1]) - xScale(d[0])));

    // Add deficit rectangles
    svg
      .append('g')
      .selectAll('rect')
      .data(deficitData)
      .join('rect')
      .attr('y', (d) => yScale(d.label)!)
      .attr('x', xScale(0)) // Start at 0 for animation
      .attr('width', 0) // Start with width 0 for animation
      .attr('height', yScale.bandwidth())
      .attr('fill', '#F2695D') // Use a distinct color for deficit
      .attr('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        setTooltipState({
          position: { x, y },
          content: `Deficit: $${d.value.toFixed(2)}`,
        });
      })
      .on('mousemove', (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        setTooltipState({
          position: { x, y },
          content: `Deficit: $${d.value.toFixed(2)}`,
        });
      })
      .on('mouseout', () => {
        setTooltipState({ position: null });
      })
      .transition()
      .duration(duration)
      .attr('x', (d) => xScale(Math.min(0, d.value))) // Animate to final x position
      .attr('width', (d) => Math.abs(xScale(d.value) - xScale(0))); // Animate to final width

    const xAxis = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${margin.top})`)
      .call(
        d3.axisTop(xScale).tickFormat((d) => `$${d3.format(',')(d as number)}`)
      );

    xAxis
      .selectAll('text')
      .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
      .attr('font-weight', '400')
      .style('fill', 'white');

    xAxis.selectAll('.tick line').attr('stroke', 'white');
    xAxis.selectAll('.domain').remove();

    const yAxis = svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    yAxis
      .selectAll('text')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-30)')
      .attr('dy', '-0.4em') // Move text up slightly
      .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
      .attr('font-weight', '400')
      .style('fill', 'white');

    yAxis.selectAll('.tick line').attr('stroke', 'white');
    yAxis.selectAll('.domain').remove();

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

    if (xDomainMin < 0 && xDomainMax > 0) {
      // Create a group for labels
      const labelsGroup = svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom / 2})`);

      // Expenses label
      labelsGroup
        .append('text')
        .attr('x', zeroX - 10) // 10px left of 0
        .attr('y', 0)
        .attr('text-anchor', 'end') // Right-align text
        .attr('fill', 'white')
        .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
        .attr('font-size', 12)
        .text('← Expenses');

      // Surplus label
      labelsGroup
        .append('text')
        .attr('x', zeroX + 10) // 10px right of 0
        .attr('y', 0)
        .attr('text-anchor', 'start') // Left-align text
        .attr('fill', 'white')
        .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
        .attr('font-size', 12)
        .text('Surplus →');
    }
  }, [data, width, height, keys]);

  return (
    <>
      <ChartContainer>
        <svg ref={ref} width={width} height={height} />
        <Legend data={legendData} position='absolute' />
      </ChartContainer>
      {width > 0 && <SaveAsImg svgRef={ref} />}
    </>
  );
};

export default React.memo(BarChartStacked);
