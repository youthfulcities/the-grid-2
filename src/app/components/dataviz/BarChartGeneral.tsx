'use client';

import truncateText from '@/lib/truncateText';
import * as d3 from 'd3';
import _ from 'lodash';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Customize from './Customize';

interface DataItem {
  option_en: string;
  count_Total: number;
  percentage_Total: number;
}

interface TooltipState {
  position: { x: number; y: number } | null;
  content?: string;
  group?: string;
}

interface BarChartProps {
  width: number;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  data: DataItem[];
  children?: ReactNode;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

interface ResponseGroup {
  option_en: string;
  count_Total: number;
  percentage_Total: number;
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
  tooltipState,
  setTooltipState,
  data,
  children,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const height = width * 0.7; // Keep height proportional to width
  const [leftMargin, setLeftMargin] = useState(10);
  const margin = { left: leftMargin, right: 10, top: 0, bottom: 80 };
  const duration = 1000;
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const [activeLegendItems, setActiveLegendItems] = useState<string[]>([]);
  const [dataToDisplay, setDataToDisplay] = useState<ResponseGroup[]>([]);
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
    const answers = _.uniq((data || []).map((d) => d.option_en));
    setAllOptions(answers);
    setSelectedAnswers(answers);
    const storedOptions = sessionStorage.getItem('selectedAnswers');
    if (storedOptions && storedOptions.length > 2) {
      setSelectedAnswers(JSON.parse(storedOptions));
    } else setSelectedAnswers(answers.slice(0, answers.length));

    // Get the length of the longest item in allOptions using lodash
    const maxLength = _.get(_.maxBy(answers, 'length'), 'length', 0);
    console.log(maxLength);

    if (maxLength * 10 < truncateThreshold * 5) {
      // Update the left margin based on the max label length
      const estimatedLabelWidth = maxLength * 10;
      setLeftMargin(estimatedLabelWidth);
    } else setLeftMargin(truncateThreshold * 5);
  }, [data]);

  // Update selected answers to display
  useEffect(() => {
    if (!data || !selectedAnswers) return;
    const processedDataToDisplay = data.filter((d) =>
      selectedAnswers.includes(d.option_en)
    );
    setDataToDisplay(processedDataToDisplay);
  }, [selectedAnswers]);

  useEffect(() => {
    if (!dataToDisplay || !selectedAnswers || !width || !height) return;

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .on('mouseleave', () => setTooltipState({ position: null }));

    svg.selectAll('*').remove(); // Clear existing content

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataToDisplay, (d) => d.percentage_Total) || 100])
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
          .tickFormat((d) => `${d}%`)
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
      .text('Percent');

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
      .attr('x', xScale(0))
      .attr('y', (d) => yScale(d.option_en) as number)
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => colorScale(d.option_en) as string)
      .on('mouseover', (event, d) => {
        setTooltipState({
          position: { x: event.pageX, y: event.pageY },
          content: `${d.percentage_Total}% selected "${d.option_en}"`,
        });
      })
      .on('mousemove', (event, d) => {
        setTooltipState({
          position: { x: event.pageX, y: event.pageY },
          content: `${d.percentage_Total}% selected "${d.option_en}"`,
        });
      })
      .on('mouseout', () => {
        setTooltipState(() => ({ position: null }));
      })
      .transition()
      .duration(duration)
      .delay((d, i) => i * (duration / 10))
      .attr('width', (d) => xScale(d.percentage_Total) - xScale(0));
  }, [dataToDisplay, width, height, leftMargin]);

  return (
    <>
      <ChartContainer>
        <svg ref={ref} />
      </ChartContainer>
      {children}
      <Customize
        selectedOptions={selectedAnswers}
        setSelectedOptions={setSelectedAnswers}
        allOptions={allOptions}
      />
    </>
  );
};

export default BarChart;
