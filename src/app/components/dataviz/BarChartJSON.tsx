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
  data: ResponseGroup | number | null;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

const ChartContainer = styled.div`
  position: relative;
  margin-bottom: var(--amplify-space-xl);
`;

const colors = [
  '#F2695D',
  '#FBD166',
  '#B8D98D',
  '#253D88',
  '#F6D9D7',
  '#673934',
];
const newColors = [
  '#F2695D',
  '#FBD166',
  '#B8D98D',
  '#2f4eac',
  '#F6D9D7',
  '#af6860',
];

const saturatedColors = colors.map((color) => {
  const hsl = d3.hsl(color);
  hsl.s = Math.min(1, hsl.s * 1.5); // Increase saturation by 50%
  return hsl.formatHex(); // Return the new color in hex format
});

const BarChart: React.FC<BarProps> = ({
  width,
  tooltipState,
  setTooltipState,
  data,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const [activeLegendItems, setActiveLegendItems] = useState<string[]>([]);
  const [validSegmentOptions, setValidSegmentOptions] = useState<string[]>([]);
  const [leftMargin, setLeftMargin] = useState(50);
  const [dataToDisplay, setDataToDisplay] = useState<ResponseGroup[]>([]);
  const height = width;
  const margin = { left: leftMargin, right: 10, top: 0, bottom: 60 };
  const duration = 1000;
  const sampleCutoff = 50;
  const truncateThreshold = 25;

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

    // Calculate averages for each answer
    const answerAverages = selectedAnswers.map((answer) => {
      const totalValue = segmentOptions.reduce(
        (sum, option) => sum + _.get(data, [answer, option], 0),
        0
      );
      const totalSample = segmentOptions.reduce(
        (sum, option) => sum + _.get(data, ['Total Sample', option], 0),
        0
      );
      const average = totalSample ? (totalValue / totalSample) * 100 : 0;
      return { answer, average: +average.toFixed(1) }; // Keep average as a number
    });

    // Prepare data for display
    const processedDataToDisplay = _.flatMap(selectedAnswers, (answer) => {
      // Find the average for the current answer
      const answerAverage =
        answerAverages.find((avg) => avg.answer === answer)?.average || 0;

      return _.chain(processedValidSegmentOptions)
        .map((option) => {
          const value = _.get(data, [answer, option], 0); // Get the value
          if (value < sample) return null; // Skip values below the cutoff
          const totalSample = _.get(data, ['Total Sample', option], 1); // Total sample for the option
          const percentage = totalSample ? (value / totalSample) * 100 : 0; // Calculate percentage
          return {
            answer,
            option,
            value: +percentage.toFixed(1), // Store the percentage as a number
            average: answerAverage, // Append the average to the object
          };
        })
        .compact() // Remove null values
        .value();
    });

    setDataToDisplay(processedDataToDisplay);
    setValidSegmentOptions(processedValidSegmentOptions);
    setActiveLegendItems(processedValidSegmentOptions);
  }, [data, selectedAnswers]);

  useEffect(() => {
    const answers = _.keys(data).filter((item) => item !== 'Total Sample');
    setAllOptions(answers);
    setSelectedAnswers(answers);
    const storedOptions = sessionStorage.getItem('selectedAnswers');
    if (storedOptions && storedOptions.length > 2) {
      setSelectedAnswers(JSON.parse(storedOptions));
    } else setSelectedAnswers(answers.slice(0, 10));

    // Get the length of the longest item in allOptions using lodash
    const maxLength = _.get(_.maxBy(answers, 'length'), 'length', 0);

    if (maxLength < truncateThreshold) {
      // Update the left margin based on the max label length
      const estimatedLabelWidth = maxLength * 8;
      setLeftMargin(estimatedLabelWidth);
    } else setLeftMargin(truncateThreshold * 5);
  }, [data]);

  useEffect(() => {
    if (
      !width ||
      !height ||
      !dataToDisplay ||
      !selectedAnswers ||
      !validSegmentOptions
    )
      return;

    const filteredDataToDisplay = dataToDisplay.filter((d) =>
      activeLegendItems.includes(d.option as string)
    );
    const maxValue = _.maxBy(filteredDataToDisplay, 'value')?.value || 100;

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

    const colorScale = d3.scaleOrdinal().range(newColors);

    const customLegendData = validSegmentOptions.map((item) => ({
      key: item,
      color: colorScale(item) as string,
    }));

    setLegendData(customLegendData);

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
      .selectAll('.bar-group')
      .data(filteredDataToDisplay)
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(0, ${yScale(d.answer as string)})`) // Position group by `answer`
      .selectAll('.bar')
      .data((d) => [d]) // Map the data within each group
      .join('rect')
      .attr('class', 'bar')
      .attr('x', xScale(0)) // Start from 0%
      .attr('y', (d) => {
        const groupIndex = activeLegendItems.indexOf(d.option as string);
        const groupHeight = yScale.bandwidth();
        const barHeight = groupHeight / activeLegendItems.length;
        return groupIndex * barHeight;
      })
      .attr('pointer-events', 'all')
      .on('mouseover', (event, d) => {
        setTooltipState({
          position: { x: event.pageX, y: event.pageY },
          content: `${d.value}% of youth who identify as ${d.option} selected ${d.answer}`,
          group: `National average: ${d.average}%`,
        });
      })
      .on('mousemove', (event, d) => {
        setTooltipState({
          position: { x: event.pageX, y: event.pageY },
          content: `${d.value}% of youth who identify as ${d.option} selected ${d.answer}`,
          group: `National average: ${d.average}%`,
        });
      })
      .on('mouseout', () => {
        setTooltipState(() => ({ position: null }));
      })
      .attr('height', () => yScale.bandwidth() / activeLegendItems.length - 2) // Adjust height with padding
      .attr('fill', (d) => colorScale(d.option as string) as string) // Use color based on `region`
      .attr('x', xScale(0)) // Start position of the bar
      .attr('width', 0) // Initially set width to 0 for animation
      .transition() // Start the transition
      .duration(duration) // Set duration for the transition
      .delay((d, i) => i * (duration / 10)) // Add delay for staggered animation
      .attr('width', (d) => xScale(d.value as number) - xScale(0));

    // Add dotted lines for averages
    svg
      .selectAll('.average-line')
      .data(filteredDataToDisplay)
      .join('line')
      .attr('class', 'average-line')
      .attr('x1', (d) => xScale(d.average as number)) // Position based on the average value
      .attr('x2', (d) => xScale(d.average as number)) // Same as x1 for a vertical line
      .attr('y1', (d) => yScale(d.answer as string) as number) // Start at the top of the group
      .attr(
        'y2',
        (d) => (yScale(d.answer as string) as number) + yScale.bandwidth()
      ) // End at the bottom of the group
      .attr('stroke', 'white') // Line color
      .attr('stroke-dasharray', '4') // Dotted line style
      .attr('stroke-width', 2)
      .attr('opacity', '0.9');
  }, [
    data,
    dataToDisplay,
    width,
    height,
    selectedAnswers,
    validSegmentOptions,
    leftMargin,
    activeLegendItems,
  ]);

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
