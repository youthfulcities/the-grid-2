'use client';

import { useTooltip } from '@/app/context/TooltipContext';
import useTranslation from '@/app/i18n/client';
import truncateText from '@/utils/truncateText';
import { Placeholder, View } from '@aws-amplify/ui-react';
import * as d3 from 'd3';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FlexibleDataItem } from './BarChartStacked';
import Customize from './Customize';
import SaveAsImg from './SaveAsImg';

interface BarChartProps {
  height?: number;
  width?: number;
  data: FlexibleDataItem[];
  labelAccessor: (d: FlexibleDataItem) => string;
  valueAccessor: (d: FlexibleDataItem) => number;
  tooltipFormatter?: (d: FlexibleDataItem) => string | JSX.Element | ReactNode;
  filterLabel?: string | null;
  xLabel?: string;
  mode?: 'percent' | 'absolute';
  onBarClick?: (label: string) => void;
  children?: React.ReactNode;
  marginLeft?: number;
  customize?: boolean;
  saveAsImg?: boolean;
  truncateThreshold?: number;
  colors?: string[];
  tFile?: string;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
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

const BarChart: React.FC<BarChartProps> = ({
  width,
  data,
  children,
  mode = 'percent',
  xLabel = 'Percent',
  labelAccessor,
  valueAccessor,
  tooltipFormatter,
  onBarClick,
  filterLabel,
  marginLeft,
  height = 600,
  customize = true,
  saveAsImg = true,
  truncateThreshold = 35,
  colors = defaultColors,
  tFile,
}) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, tFile);

  const ref = useRef<SVGSVGElement>(null);
  const [leftMargin, setLeftMargin] = useState(10);
  const margin = useMemo(
    () => ({
      left: marginLeft ?? leftMargin,
      right: 10,
      top: 0,
      bottom: 60,
    }),
    [marginLeft, leftMargin]
  );
  const duration = 1000;
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const [activeLegendItems, setActiveLegendItems] = useState<string[]>([]);
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const sampleCutoff = 50;
  const { setTooltipState } = useTooltip();

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
    } else {
      setSelectedAnswers(answers.slice(0, answers.length) as string[]);
    }

    // Measure true label width using canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = '14px sans-serif'; // Update to match your app's actual font

      const maxTextWidth = answers.reduce((max, label) => {
        const { width: textWidth } = context.measureText(label);
        return Math.max(max, textWidth);
      }, 0);

      const marginPadding = 12; // extra space for axis/ticks
      const maxAllowed = truncateThreshold * 6; // soft cap

      setLeftMargin(Math.min(maxTextWidth + marginPadding, maxAllowed));
    }
  }, [data]);

  // Update selected answers to display
  const dataToDisplay = useMemo(() => {
    if (!data || !selectedAnswers) return [];
    return data.filter((d) => selectedAnswers.includes(labelAccessor(d)));
  }, [data, selectedAnswers]);

  useEffect(() => {
    if (!ref.current || !dataToDisplay || !selectedAnswers || !height) return;

    const svg = d3
      .select(ref.current)
      .attr('width', width ?? 0)
      .attr('height', height);

    svg.selectAll('*').remove(); // Clear existing content
    svg.on('mouseout', () => {
      setTooltipState({ position: null });
    });

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataToDisplay, (d) => valueAccessor(d) as number) || 100,
      ])
      .nice()
      .range([margin.left, (width ?? 0) - margin.right]);

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
      .attr('x', (width ?? 0) / 2)
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
  }, [
    dataToDisplay,
    width,
    height,
    leftMargin,
    filterLabel,
    colors,
    labelAccessor,
    valueAccessor,
    tooltipFormatter,
    setTooltipState,
    margin,
    mode,
    xLabel,
    onBarClick,
    selectedAnswers,
    truncateThreshold,
  ]);

  return (
    <View width='100%'>
      {!dataToDisplay ? (
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
          {customize && (
            <Customize
              selectedOptions={selectedAnswers}
              setSelectedOptions={setSelectedAnswers}
              allOptions={allOptions}
            />
          )}
          {saveAsImg && <SaveAsImg svgRef={ref} />}
        </>
      )}
    </View>
  );
};

export default React.memo(BarChart);
