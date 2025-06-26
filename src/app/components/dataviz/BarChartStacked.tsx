import { useThemeContext } from '@/app/context/ThemeContext';
import toGreyscale from '@/utils/toGreyscale';
import { Button, Flex, Placeholder } from '@aws-amplify/ui-react';
import * as d3 from 'd3';
import { SeriesPoint } from 'd3';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Customize from './Customize';
import Legend from './Legend';
import SaveAsImg from './SaveAsImg';

const defaultColors = [
  '#8755AF',
  '#F2695D',
  '#FBD166',
  '#B8D98D',
  '#00BFA9',
  '#2f4eac',
  '#F6D9D7',
  '#af6860',
];

const ChartContainer = styled.div`
  position: relative;
`;

// Define a type alias for the keys in a stack (usually a string)
export type StackKey = string;

export interface FlexibleDataItem {
  [key: string]: number | string;
}

// Extend d3’s Series type so that each series has a key property.
export type StackSeries = d3.Series<FlexibleDataItem, StackKey>;

interface TooltipState {
  position: { x: number; y: number } | null;
  content?: string | React.ReactNode;
  group?: string;
}

interface BarChartProps {
  loading?: boolean;
  width: number;
  data: FlexibleDataItem[];
  keys: string[];
  labelAccessor: (d: FlexibleDataItem) => string;
  keyAccessor?: (d: FlexibleDataItem) => string;
  tooltipFormatter?: (
    d: FlexibleDataItem,
    key?: string,
    value?: number
  ) => string | React.ReactNode;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  onBarClick?: (d: FlexibleDataItem | SeriesPoint<FlexibleDataItem>) => void;
  filterLabel?: string | null;
  marginLeft?: number;
  height?: number;
  colors?: string[];
  children?: React.ReactNode;
  id?: string;
}

const BarChartStacked: React.FC<BarChartProps> = ({
  height = 800,
  width = 600,
  setTooltipState,
  loading = false,
  data,
  keys,
  labelAccessor,
  keyAccessor,
  marginLeft,
  tooltipFormatter,
  colors = defaultColors,
  onBarClick,
  filterLabel,
  children,
  id,
}) => {
  const { colorMode } = useThemeContext();
  const [customSortOrder, setCustomSortOrder] = useState<'asc' | 'desc' | null>(
    null
  );
  const [activeLegendItems, setActiveLegendItems] = useState<string[]>(() => [
    ...keys,
  ]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    data.map((d) => labelAccessor(d).replace(/[^a-zA-Z0-9]/g, ''))
  );
  const ref = useRef<SVGSVGElement | null>(null);
  const duration = 1000;
  const margin = {
    left: marginLeft ?? 60,
    right: 20,
    top: 40,
    bottom: 40,
  };

  const allOptions = useMemo(
    () => data.map((d) => labelAccessor(d).replace(/[^a-zA-Z0-9]/g, '')),
    [data, labelAccessor]
  );

  useEffect(() => {
    if (selectedAnswers.length === 0) {
      setSelectedAnswers(allOptions);
    }
  }, [allOptions, selectedAnswers]);

  // Update activeLegendItems whenever keys change.
  useEffect(() => {
    setActiveLegendItems([...keys]);
  }, [keys]);

  const filteredKeys = useMemo(
    () => keys.filter((key) => key !== 'deficit'),
    [keys]
  );

  const legendData = useMemo(
    () => [
      ...filteredKeys // Exclude 'deficit' first
        .map((key, index) => ({
          key,
          color: colors[index] || '#000', // Default color if out of bounds
        })),

      ...(keys.includes('deficit')
        ? [{ key: 'deficit', color: '#F2695D' }]
        : []), // Add deficit only if it's in the keys array
    ],
    [filteredKeys, colors, keys]
  );

  const filteredData = useMemo(() => {
    let filtered = data.filter((d) =>
      selectedAnswers.includes(labelAccessor(d).replace(/[^a-zA-Z0-9]/g, ''))
    );
    if (customSortOrder) {
      filtered = [...filtered].sort((a, b) => {
        if (
          activeLegendItems.includes('surplus') ||
          activeLegendItems.includes('deficit')
        ) {
          if (b.surplus !== a.surplus) {
            return customSortOrder === 'asc'
              ? (a.surplus as number) - (b.surplus as number)
              : (b.surplus as number) - (a.surplus as number);
          }
          return customSortOrder === 'asc'
            ? (a.deficit as number) - (b.deficit as number)
            : (b.deficit as number) - (a.deficit as number);
        }
        // Else, sort by sum of values for active legend items.
        const aValue = d3.sum(
          activeLegendItems.map((key) => (a[key] as number) || 0)
        );
        const bValue = d3.sum(
          activeLegendItems.map((key) => (b[key] as number) || 0)
        );
        return customSortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }
    return filtered;
  }, [
    data,
    selectedAnswers,
    labelAccessor,
    customSortOrder,
    activeLegendItems,
  ]);

  useEffect(() => {
    setCustomSortOrder(null);
  }, [data]);

  useEffect(() => {
    if (!ref.current || !data || !width || !height) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.on('mouseout', () => {
      setTooltipState({ position: null });
    });

    const color = d3.scaleOrdinal<string>().domain(filteredKeys).range(colors);

    const stackGenerator = d3
      .stack<{ [key: string]: number | string }>()
      .keys(activeLegendItems.filter((key) => key !== 'deficit')) // Exclude 'deficit' from the main stack
      .offset(d3.stackOffsetDiverging);

    //hide deficit if hidden by clicking the legend
    const showDeficit = activeLegendItems.includes('deficit');

    const deficitData = showDeficit
      ? filteredData.map((d) => ({
          label: labelAccessor(d),
          value: d.deficit as number,
        }))
      : [];

    const currentSeries = stackGenerator(filteredData);

    const allValues = currentSeries.flatMap((s) =>
      s.map((d) => [d[0], d[1]]).flat()
    );

    const xDomainMin = Math.min(0, d3.min(allValues)!);
    const xDomainMax = Math.max(0, d3.max(allValues)!);

    const yScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => labelAccessor(d)))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    const xScale = d3
      .scaleLinear()
      .domain([xDomainMin, xDomainMax])
      .nice()
      .range([margin.left, width - margin.right]);
    const series = stackGenerator(filteredData);

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
      .attr('fill', (d) => {
        const barLabel = labelAccessor(d.data);
        const originalColor = color(d.key);
        if (filterLabel && filterLabel !== barLabel) {
          return toGreyscale(originalColor as string);
        }
        return originalColor;
      })
      // .attr('opacity', (d: SeriesPoint<FlexibleDataItem>) =>
      //   d.data?.sample && (d.data.sample as number) < 50 ? 0.8 : 1
      // )
      .on('click', (event, d: SeriesPoint<FlexibleDataItem>) => {
        if (onBarClick) {
          // const label = labelAccessor(d.data);
          onBarClick(d);
        }
      })
      .on('mouseover', (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        const { key } = d;
        const value = d[1] - d[0];
        setTooltipState({
          position: { x, y },
          content: tooltipFormatter
            ? tooltipFormatter(d.data, key, value)
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
            ? tooltipFormatter(d.data, key, value)
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
      .on('click', (event, d) => {
        if (onBarClick) {
          // const label = labelAccessor(d);
          onBarClick(d);
        }
      })
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
      .attr('text-anchor', 'start')
      .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
      .attr('font-weight', '400')
      .attr('transform', 'rotate(-30)')
      .attr('dy', '-0.4em')
      .style('fill', colorMode === 'dark' ? 'white' : 'black');

    xAxis
      .selectAll('.tick line')
      .attr('stroke', colorMode === 'dark' ? 'white' : 'black');
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
      .style('fill', colorMode === 'dark' ? 'white' : 'black');

    yAxis
      .selectAll('.tick line')
      .attr('stroke', colorMode === 'dark' ? 'white' : 'black');
    yAxis.selectAll('.domain').remove();

    // Find pixel position of 0
    const zeroX = xScale(0);

    svg
      .append('line')
      .attr('x1', zeroX)
      .attr('x2', zeroX)
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', colorMode === 'dark' ? 'white' : 'black')
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
        .attr('fill', colorMode === 'dark' ? 'white' : 'black')
        .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
        .attr('font-size', 12)
        .text('← Expenses');

      // Surplus label
      labelsGroup
        .append('text')
        .attr('x', zeroX + 10) // 10px right of 0
        .attr('y', 0)
        .attr('text-anchor', 'start') // Left-align text
        .attr('fill', colorMode === 'dark' ? 'white' : 'black')
        .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
        .attr('font-size', 12)
        .text('Surplus →');
    }
  }, [
    data,
    width,
    height,
    keys,
    filterLabel,
    activeLegendItems,
    selectedAnswers,
    colorMode,
    colors,
    customSortOrder,
  ]);

  return (
    <>
      {loading ? (
        <Placeholder width={width} height={height} />
      ) : (
        <>
          <ChartContainer>
            <svg ref={ref} width={width} height={height} id={id || ''} />
            <Legend
              data={legendData}
              activeLegendItems={activeLegendItems}
              setActiveLegendItems={setActiveLegendItems}
              position='absolute'
            />
          </ChartContainer>
          <Customize
            selectedOptions={selectedAnswers}
            setSelectedOptions={setSelectedAnswers}
            allOptions={allOptions}
          />
          <Flex width='100%' wrap='wrap' marginTop='small' gap='xs'>
            <>
              {children}
              <Button
                fontSize='small'
                onClick={() => setCustomSortOrder('asc')}
              >
                Sort Ascending
              </Button>
              <Button
                fontSize='small'
                onClick={() => setCustomSortOrder('desc')}
              >
                Sort Descending
              </Button>
              {width > 0 && <SaveAsImg svgRef={ref} id={id} />}
            </>
          </Flex>
        </>
      )}
    </>
  );
};

export default React.memo(BarChartStacked);
