'use client';

import { useTooltip } from '@/app/context/TooltipContext';
import { Placeholder, View } from '@aws-amplify/ui-react';
import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import SaveAsImg from './SaveAsImg';

interface FlexibleDataItem {
  [key: string]: string | number | undefined;
}

interface LineChartProps {
  height?: number;
  width?: number;
  data: FlexibleDataItem[];
  labelAccessor: (d: FlexibleDataItem) => string;
  valueAccessor: (d: FlexibleDataItem) => number;
  tooltipFormatter?: (d: FlexibleDataItem) => string;
  xLabel?: string;
  yLabel?: string;
  onPointClick?: (d: FlexibleDataItem) => void;
  children?: React.ReactNode;
  marginLeft?: number;
  customize?: boolean;
  saveAsImg?: boolean;
  colors?: string[];
  truncateThreshold?: number;
  seriesAccessor?: (d: FlexibleDataItem) => string;
}

const ChartContainer = styled.div`
  position: relative;
  margin-bottom: var(--amplify-space-xl);
`;

const defaultColors = [
  '#F2695D',
  '#FBD166',
  '#B8D98D',
  '#2f4eac',
  '#F6D9D7',
  '#af6860',
];

const LineChart: React.FC<LineChartProps> = ({
  width,
  height = 600,
  data,
  labelAccessor,
  valueAccessor,
  tooltipFormatter,
  xLabel = 'Age',
  yLabel = 'Income',
  onPointClick,
  children,
  marginLeft = 60,
  customize = true,
  saveAsImg = true,
  colors = defaultColors,
  truncateThreshold = 35,
  seriesAccessor,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const { setTooltipState } = useTooltip();

  const margin = {
    left: marginLeft,
    right: 20,
    top: 20,
    bottom: 70,
  };

  // We'll group data by a "series" key if needed, here assuming single line for simplicity
  // If multiple series, you'd adjust to group by a series accessor and draw multiple lines

  useEffect(() => {
    if (!ref.current || !data) return;

    const svgWidth = width ?? 800;
    const svgHeight = height;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', svgWidth).attr('height', svgHeight);

    // Parse or ensure x values are Date objects or numbers (timestamps)
    const xValues = data.map(labelAccessor);
    const yValues = data.map(valueAccessor);

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(xValues)
      .range([margin.left, svgWidth - margin.right])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(yValues) ?? 100])
      .range([svgHeight - margin.bottom, margin.top])
      .nice();

    // Axes
    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale).ticks(6);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', 'white')
      .attr('transform', 'rotate(-30)')
      .style('text-anchor', 'end');

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll('text')
      .attr('fill', 'white');

    // Axis labels
    svg
      .append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', (svgWidth + margin.left - margin.right) / 2)
      .attr('y', svgHeight - 15)
      .attr('fill', 'white')
      .text(xLabel);

    svg
      .append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr(
        'transform',
        `translate(15, ${(svgHeight - margin.top - margin.bottom) / 2 + margin.top}) rotate(-90)`
      )
      .attr('fill', 'white')
      .text(yLabel);

    // Line generator
    const lineGenerator = d3
      .line<FlexibleDataItem>()
      .defined((d) => !Number.isNaN(valueAccessor(d)))
      .x((d) => xScale(labelAccessor(d) ?? '') ?? 0)
      .y((d) => yScale(valueAccessor(d)))
      .curve(d3.curveMonotoneX); // smooth line

    if (seriesAccessor) {
      const grouped = d3.group(data, seriesAccessor);
      let colorIndex = 0;

      grouped.forEach((groupData, seriesKey) => {
        const path = svg
          .append('path')
          .datum(groupData)
          .attr('fill', 'none')
          .attr('stroke', colors[colorIndex % colors.length])
          .attr('stroke-width', 2)
          .attr('d', lineGenerator);

        const totalLength = path.node()?.getTotalLength() ?? 0;
        path
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeCubic)
          .attr('stroke-dashoffset', 0);

        // Draw circles for each data point in this series
        svg
          .selectAll(`.data-point-${seriesKey}`)
          .data(groupData)
          .enter()
          .append('circle')
          .attr('cursor', 'pointer')
          .attr('class', `data-point-${seriesKey}`)
          .attr('cx', (d) => xScale(labelAccessor(d).toString())!)
          .attr('cy', (d) => yScale(valueAccessor(d)))
          .attr('r', 4)
          .attr('fill', colors[colorIndex % colors.length])
          .on('mouseover', (event, d) => {
            setTooltipState({
              position: { x: event.pageX, y: event.pageY },
              content: tooltipFormatter
                ? tooltipFormatter(d)
                : `${labelAccessor(d)} - ${valueAccessor(d)}`,
            });
          })
          .on('mouseout', () => {
            setTooltipState({ position: null });
          })
          .on('click', (event, d) => {
            if (onPointClick) onPointClick(d);
          })
          .style('opacity', 0)
          .transition()
          .delay((d, i) => i * 100)
          .duration(500)
          .style('opacity', 1);
        colorIndex += 1;
      });
    } else {
      // Single series: draw one line for all data
      const path = svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colors[0] || 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

      const totalLength = path.node()?.getTotalLength() ?? 0;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeCubic)
        .attr('stroke-dashoffset', 0);

      svg
        .selectAll('.data-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('cursor', 'pointer')
        .attr('class', 'data-point')
        .attr('cx', (d) => xScale(labelAccessor(d).toString())!)
        .attr('cy', (d) => yScale(valueAccessor(d)))
        .attr('r', 4)
        .attr('fill', colors[0] || 'steelblue')
        .on('mouseover', (event, d) => {
          setTooltipState({
            position: { x: event.pageX, y: event.pageY },
            content: tooltipFormatter
              ? tooltipFormatter(d)
              : `${labelAccessor(d)} - ${valueAccessor(d)}`,
          });
        })
        .on('mouseout', () => {
          setTooltipState({ position: null });
        })
        .on('click', (event, d) => onPointClick && onPointClick(d))
        .style('opacity', 0)
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .style('opacity', 1);
    }
  }, [
    data,
    width,
    height,
    margin.left,
    margin.right,
    margin.top,
    margin.bottom,
    colors,
    labelAccessor,
    valueAccessor,
    tooltipFormatter,
    xLabel,
    yLabel,
    setTooltipState,
    onPointClick,
    seriesAccessor,
  ]);

  return (
    <View width='100%'>
      {!data ? (
        <Placeholder
          isLoaded={false}
          width='100%'
          minHeight='600px'
          data-testid='line-chart-placeholder'
        />
      ) : (
        <>
          <ChartContainer>
            <svg ref={ref} data-testid='line-chart' />
          </ChartContainer>
          {children}
          {/* {customize && <Customize />} */}
          {saveAsImg && <SaveAsImg svgRef={ref} />}
        </>
      )}
    </View>
  );
};

export default React.memo(LineChart);
