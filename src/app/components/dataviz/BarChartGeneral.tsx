'use client';

import truncateText from '@/utils/truncateText';
import { Placeholder, View } from '@aws-amplify/ui-react';
import * as d3 from 'd3';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Customize from './Customize';
import SaveAsImg from './SaveAsImg';

interface FlexibleDataItem {
  [key: string]: string | number | undefined;
}

interface TooltipState {
  position: { x: number; y: number } | null;
  content?: string;
  group?: string;
}

interface BarChartProps {
  width: number;
  data: FlexibleDataItem[];
  labelAccessor: (d: FlexibleDataItem) => string;
  valueAccessor: (d: FlexibleDataItem) => number;
  tooltipFormatter?: (d: FlexibleDataItem) => string;
  tooltipState: TooltipState;
  filterLabel?: string | null;
  xLabel?: string;
  mode?: 'percent' | 'absolute';
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  onBarClick?: (label: string) => void;
  children?: React.ReactNode;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

interface ResponseGroup {
  [key: string]: string | number;
}

const ChartContainer = styled.div`
  position: relative;
  margin-bottom: var(--amplify-space-xl);
`;

const colors = [
  '#F2695D',
  '#FBD166',
  '#B8D98D',
  '#2f4eac',
  '#F6D9D7',
  '#af6860',
];

const BarChart: React.FC<BarChartProps> = ({
  width,
  setTooltipState,
  data,
  children,
  mode = 'percent',
  xLabel = 'Percent',
  labelAccessor,
  valueAccessor,
  tooltipFormatter,
  onBarClick,
  filterLabel,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const height = 600;
  const [leftMargin, setLeftMargin] = useState(10);
  const margin = { left: leftMargin, right: 10, top: 0, bottom: 80 };
  const duration = 1000;
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const [activeLegendItems, setActiveLegendItems] = useState<string[]>([]);
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const sampleCutoff = 50;
  const truncateThreshold = 35;

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage) {
      const storedOptions = sessionStorage.getItem('selectedAnswers');
      if (storedOptions) {
        setSelectedAnswers(JSON.parse(storedOptions));
      }
    }
  }, []);

  // Get all options/answers and truncate if necessary
  useEffect(() => {
    if (!data) return;
    const answers = _.uniq((data || []).map((d) => labelAccessor(d)));
    setAllOptions(answers as string[]);
    setSelectedAnswers(answers as string[]);
    const storedOptions = sessionStorage.getItem('selectedAnswers');
    if (storedOptions && storedOptions.length > 2) {
      setSelectedAnswers(JSON.parse(storedOptions));
    } else setSelectedAnswers(answers.slice(0, answers.length) as string[]); // change me to show more or less answers at one time

    // Get the length of the longest item in allOptions using lodash
    const maxLength = _.get(_.maxBy(answers, 'length'), 'length', 0);

    if (maxLength * 10 < truncateThreshold * 5) {
      // Update the left margin based on the max label length
      const estimatedLabelWidth = maxLength * 10;
      setLeftMargin(estimatedLabelWidth);
    } else setLeftMargin(truncateThreshold * 5);
  }, [data]);

  // Update selected answers to display
  const dataToDisplay = useMemo(() => {
    if (!data || !selectedAnswers) return [];
    return data.filter((d) => selectedAnswers.includes(labelAccessor(d)));
  }, [data, selectedAnswers]);

  useEffect(() => {
    if (!ref.current || !dataToDisplay || !selectedAnswers || !width || !height)
      return;

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .on('mouseleave', () => setTooltipState({ position: null }));

    svg.selectAll('*').remove(); // Clear existing content

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataToDisplay, (d) => valueAccessor(d) as number) || 100,
      ])
      .nice()
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(selectedAnswers)
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const colorScale = d3.scaleOrdinal().range(colors);

    // Axes
    // x-axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickFormat((d) =>
            mode === 'percent' ? `${d}%` : d.toLocaleString()
          )
      )
      .selectAll('text')
      .style('fill', 'white');

    // Append x-axis title
    svg
      .append('text')
      .attr('class', 'x-axis-title')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-family', 'Gotham Narrow Book, Arial, sans-serif')
      .attr('font-weight', '400')
      .text(xLabel);

    // y-axis
    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat(
            (d) => truncateText(d as string, truncateThreshold) as string
          )
      )
      .selectAll('text')
      .attr('transform', 'rotate(-30)')
      .style('fill', 'white');

    // Bars
    svg
      .selectAll('.bar')
      .data(dataToDisplay)
      .join('rect')
      .attr('class', 'bar')
      .attr('data-testid', 'bar')
      .attr('x', xScale(0))
      .attr('y', (d) => yScale(labelAccessor(d)) as number)
      .attr('width', 0)
      .attr('cursor', 'pointer')
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => colorScale(labelAccessor(d) as string) as string)
      .attr('fill', (d) => {
        const label = labelAccessor(d);
        if (filterLabel && filterLabel !== label) {
          return '#ccc'; // gray for non-selected bars
        }
        return colorScale(label) as string; // full color for selected bar
      })
      .on('click', (event, d) => {
        if (onBarClick) {
          onBarClick(labelAccessor(d));
        }
      })
      .on('mouseover', (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        setTooltipState({
          position: { x, y },
          content: tooltipFormatter
            ? tooltipFormatter(d)
            : `${valueAccessor(d)}% selected "${labelAccessor(d)}"`,
        });
      })
      .on('mousemove', (event, d) => {
        const x = event.pageX;
        const y = event.pageY;
        setTooltipState({
          position: { x, y },
          content: tooltipFormatter
            ? tooltipFormatter(d)
            : `${valueAccessor(d)}% selected "${labelAccessor(d)}"`,
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
      .delay((d, i) => i * (duration / 10))
      .attr('width', (d) => xScale(valueAccessor(d) as number) - xScale(0));
  }, [dataToDisplay, width, height, leftMargin, filterLabel]);

  return (
    <View>
      {!width || !dataToDisplay ? (
        <Placeholder
          isLoaded={false}
          width='100%'
          minHeight='600px'
          data-testid='bar-chart-general-placeholder'
        />
      ) : (
        <>
          <ChartContainer>
            <svg ref={ref} data-testid='bar-chart-general' />
          </ChartContainer>
          {children}
          <Customize
            selectedOptions={selectedAnswers}
            setSelectedOptions={setSelectedAnswers}
            allOptions={allOptions}
          />
          {width > 0 && <SaveAsImg svgRef={ref} />}
        </>
      )}
    </View>
  );
};

export default BarChart;
