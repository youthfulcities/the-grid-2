'use client';

import truncateText from '@/lib/truncateText';
import * as d3 from 'd3';
import _, { sample } from 'lodash';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Customize from './Customize';
import Legend from './Legend';

interface DataItem {
  option_en: string;
  [key: string]: string | number;
}

interface ResponseGroup {
  [key: string]: string | number;
}

interface QuestionResponses {
  [key: string]: ResponseGroup;
}

interface SurveyData {
  [question: string]: QuestionResponses;
}

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  child?: ReactNode | null;
}

interface BarProps {
  width: number;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  data: ResponseGroup | null;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

const ChartContainer = styled.div`
  position: relative;
`;

const BarChart: React.FC<BarProps> = ({
  width,
  tooltipState,
  setTooltipState,
  data,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [parsedData, setParsedData] = useState<{ [key: string]: DataItem[] }>(
    {}
  );
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const [activeLegendItems, setActiveLegendItems] = useState<string[]>([]);
  const [validSegmentOptions, setValidSegmentOptions] = useState<string[]>([]);
  const [dataToDisplay, setDataToDisplay] = useState<ResponseGroup[]>([]);
  const height = width;
  const margin = { left: 150, right: 10, top: 0, bottom: 60 };
  const duration = 1000;
  const sampleCutoff = 50;

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage) {
      const storedOptions = sessionStorage.getItem('selectedAnswers');
      if (storedOptions) {
        setSelectedAnswers(JSON.parse(storedOptions));
      }
    }
  }, []);

  useEffect(() => {
    const segmentOptions = _.keys(_.values(data)[0]);

    const processedValidSegmentOptions = segmentOptions.filter((option) =>
      selectedAnswers.some(
        (answer) => _.get(data, [answer, option], 0) >= sampleCutoff
      )
    );

    const processedDataToDisplay = _.flatMap(selectedAnswers, (answer) =>
      _.chain(processedValidSegmentOptions)
        .map((option) => {
          const value = _.get(data, [answer, option], 0); // Get the value
          if (value < sample) return null; // Skip values below 50
          const totalSample = _.get(data, ['Total Sample', option], 1); // Total sample for the option
          const percentage = totalSample ? (value / totalSample) * 100 : 0; // Calculate percentage
          return {
            answer,
            option,
            value: +percentage.toFixed(1), // Store the percentage
          };
        })
        .compact() // Remove null values
        .value()
    );

    setDataToDisplay(processedDataToDisplay);
    setValidSegmentOptions(processedValidSegmentOptions);
  }, [data, selectedAnswers]);

  useEffect(() => {
    const answers = _.keys(data).filter((item) => item !== 'Total Sample');
    setAllOptions(answers);
    setSelectedAnswers(answers);
    const storedOptions = sessionStorage.getItem('selectedAnswers');
    if (storedOptions && storedOptions.length > 2) {
      setSelectedAnswers(JSON.parse(storedOptions));
    } else setSelectedAnswers(answers.slice(0, 10));
  }, [data]);

  useEffect(() => {
    setActiveLegendItems(validSegmentOptions);
  }, [validSegmentOptions]);

  useEffect(() => {
    if (!width || !height || !dataToDisplay) return;

    const maxValue = _.maxBy(dataToDisplay, 'value')?.value || 100;

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .on('mouseleave', () => {
        setTooltipState({ position: null });
      });

    // Clear existing content
    svg.selectAll('*').remove();

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, +maxValue])
      .nice()
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(selectedAnswers)
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const customLegendData = validSegmentOptions.map((item) => ({
      key: item,
      color: colorScale(item),
    }));

    setLegendData(customLegendData);

    // Axes

    // x-axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5))
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
          .tickFormat((d) => truncateText(d as string, 25) as string)
      )
      .selectAll('text')
      .attr('transform', 'rotate(-30)')
      .style('fill', 'white');

    // Bars
    svg
      .selectAll('.bar-group')
      .data(dataToDisplay)
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(0, ${yScale(d.answer as string)})`) // Position group by `answer`
      .selectAll('.bar')
      .data((d) => [d]) // Map the data within each group
      .join('rect')
      .attr('class', 'bar')
      .attr('x', xScale(0)) // Start from 0%
      .attr('y', (d) => {
        const groupIndex = validSegmentOptions.indexOf(d.option as string);
        const groupHeight = yScale.bandwidth();
        const barHeight = groupHeight / validSegmentOptions.length;
        return groupIndex * barHeight;
      })
      .attr('pointer-events', 'all')
      .on('mouseover', (event, d) => {
        setTooltipState({
          position: { x: event.pageX, y: event.pageY },
          content: `${d.value}% of youth who identify as ${d.option} selected ${d.answer}`,
        });
      })
      .on('mousemove', (event, d) => {
        setTooltipState({
          position: { x: event.pageX, y: event.pageY },
          content: `${d.value}% of youth who identify as ${d.option} selected ${d.answer}`,
        });
      })
      .on('mouseout', () => {
        setTooltipState(() => ({ position: null }));
      })
      .attr('height', () => yScale.bandwidth() / validSegmentOptions.length - 2) // Adjust height with padding
      .attr('fill', (d) => colorScale(d.option as string)) // Use color based on `region`
      .attr('x', xScale(0)) // Start position of the bar
      .attr('width', 0) // Initially set width to 0 for animation
      .transition() // Start the transition
      .duration(duration) // Set duration for the transition
      .delay((d, i) => i * (duration / 10)) // Add delay for staggered animation
      .attr('width', (d) => xScale(d.value as number) - xScale(0));
  }, [data, dataToDisplay, width, height, selectedAnswers]);

  return (
    <>
      <ChartContainer>
        <svg ref={ref} />
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
    </>
  );
};

export default BarChart;
