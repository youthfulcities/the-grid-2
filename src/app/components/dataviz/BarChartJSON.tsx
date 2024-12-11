'use client';

import * as d3 from 'd3';
import _ from 'lodash';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Customize from './Customize';
import Legend from './Legend';

interface DataItem {
  option_en: string;
  [key: string]: string | number;
}

interface ResponseGroup {
  [key: string]: number;
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const [activeLegendItems, setActiveLegendItems] = useState<string[]>([]);
  const height = width;
  const margin = { left: 50, right: 50, top: 50, bottom: 50 };
  const duration = 1000;

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage) {
      const storedOptions = sessionStorage.getItem('selectedOptions');
      if (storedOptions) {
        setSelectedOptions(JSON.parse(storedOptions));
      }
    }
  }, []);

  console.log(data);

  //draw chart
  useEffect(() => {
    if (!width || !height || !data) return;

    const segmentOptions = _.keys(_.values(data)[0]);
    const answers = _.keys(data).filter((item) => item !== 'Total Sample');

    // Calculate percentages for each option
    const dataToDisplay = _.flatMap(answers, (answer) =>
      _.map(segmentOptions, (option) => {
        const value = _.get(data, [answer, option], 0);
        const totalSample = _.get(data, ['Total Sample', option], 1);
        const percentage = totalSample ? (value / totalSample) * 100 : 0; // Calculate percentage
        return {
          answer,
          option,
          value: percentage, // Store the percentage
        };
      })
    );

    const maxValue = _.maxBy(dataToDisplay, 'value')?.value || 0;

    console.log(maxValue, dataToDisplay);

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Clear existing content
    svg.selectAll('*').remove();

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .nice()
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(answers)
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Axes
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .style('fill', 'white');

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('fill', 'white');

    // Bars
    svg
      .selectAll('.bar-group')
      .data(dataToDisplay)
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(0, ${yScale(d.answer)})`) // Position group by `answer`
      .selectAll('.bar')
      .data((d) => [d]) // Map the data within each group
      .join('rect')
      .attr('class', 'bar')
      .attr('x', xScale(0)) // Start from 0%
      .attr('y', (d) => {
        const groupIndex = segmentOptions.indexOf(d.option);
        const groupHeight = yScale.bandwidth();
        const barHeight = groupHeight / segmentOptions.length;
        return groupIndex * barHeight;
      })
      .attr('height', () => yScale.bandwidth() / segmentOptions.length - 2) // Adjust height with padding
      .attr('width', (d) => xScale(d.value) - xScale(0)) // Scale width based on percentage
      .attr('fill', (d) => colorScale(d.option)) // Use color based on `region`
      .on('mouseover', (event, d) => {
        setTooltipState({
          position: { x: event.pageX, y: event.pageY },
          value: d.value,
          group: d.option,
          topic: d.answer,
        });
      })
      .on('mouseout', () =>
        setTooltipState({ ...tooltipState, position: null })
      );
  }, [data, width, height, tooltipState, setTooltipState]);

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
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        allOptions={allOptions}
      />
    </>
  );
};

export default BarChart;
