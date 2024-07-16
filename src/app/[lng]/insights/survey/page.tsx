'use client';

import Container from '@/app/components/Background';
import Tooltip from '@/app/components/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
import { Button, Flex, Heading } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface DataItem {
  [key: string]: string | number;
}

const TooltipText = styled.text`
  font-size: 1rem;
  fill: black;
  text-anchor: middle;
`;

const TooltipTextSmall = styled.text`
  font-size: 0.75rem;
  fill: black;
  text-anchor: middle;
`;

const TooltipBackground = styled.rect`
  fill: white;
  rx: 8; /* Rounded corners */
  ry: 8; /* Rounded corners */
`;

const duration = 500;

const BarChart: React.FC = () => {
  const margin = { top: 60, bottom: 40, left: 100, right: 40 };
  const containerRef = useRef<HTMLDivElement>(null);
  const chartSize = useDimensions(containerRef);
  const height = 800;
  const { width } = chartSize;
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<Record<string, DataItem[]>>({});
  const [activeFile, setActiveFile] = useState('org-attractive-gender.csv');
  const [tooltipState, setTooltipState] = useState<{
    position: { x: number; y: number } | null;
    content: string;
    group: string;
  }>({
    position: null,
    content: '',
    group: '',
  });

  useEffect(() => {
    const fetchData = async (filename: string) => {
      if (rawData.hasOwnProperty(filename)) return;

      try {
        setLoading(true);
        const downloadResult = await downloadData({
          path: `public/${filename}`,
        }).result;
        const text = await downloadResult.body.text();
        setRawData({ ...rawData, [filename]: text });
        setLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setLoading(false);
      }
    };

    const parseDynamicCSVData = (filename: string, csvString: string) => {
      if (parsedData[filename]) return;

      const parsed = d3.csvParse(csvString, (d) => {
        const row: DataItem = {};
        Object.keys(d).forEach((oldKey) => {
          const parts = oldKey.split(/DEM_|\(SUM\)/);
          const newKey = parts.length > 1 ? parts[1] : oldKey;
          row[newKey] = isNaN(+d[oldKey]) ? d[newKey] : +d[oldKey] * 100;
        });
        return row;
      });

      setParsedData({ ...parsedData, [filename]: parsed });
    };

    fetchData(activeFile);
    if (rawData[activeFile])
      parseDynamicCSVData(activeFile, rawData[activeFile]);
  }, [activeFile, rawData, parsedData]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    if (!width || !height || !parsedData[activeFile]) return;

    // Calculate scales
    const yScale = d3
      .scaleBand<string>()
      .domain(parsedData[activeFile].map((d) => String(d.option_en)))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const maxGroupValue = d3.max(parsedData[activeFile], (d) =>
      d3.max(
        Object.keys(d).filter((key) => key !== 'option_en'),
        (key) => +d[key]
      )
    ) as number;

    const xScale = d3
      .scaleLinear()
      .domain([0, maxGroupValue])
      .nice()
      .range([margin.left, width - margin.right]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // SVG element setup
    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Remove existing elements before redrawing
    svg.selectAll('*').remove();

    // Draw x-axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .style('color', 'white')
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('fill', 'white');

    // Append x-axis title
    svg
      .append('text')
      .attr('class', 'x-axis-title')
      .attr('x', width / 2)
      .attr('y', height - 5) // Adjust vertical positioning as needed
      .attr('text-anchor', 'middle')
      .attr('fill', 'white') // Adjust color as needed
      .text('Percent'); // Replace with your desired x-axis title

    // Draw y-axis
    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .style('color', 'white')
      .call(d3.axisLeft(yScale).tickFormat((d) => truncateText(d, 15)))
      .selectAll('text')
      .style('fill', 'white');

    // Draw bars
    svg
      .selectAll('.bar-group')
      .data(parsedData[activeFile])
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(0, ${yScale(String(d.option_en))})`)
      .selectAll('.bar')
      .data((d) =>
        Object.keys(d)
          .filter((key) => key !== 'option_en')
          .map((key) => ({ key, value: +d[key] }))
      )
      .join('rect')
      .attr('class', 'bar')
      .attr('x', xScale(0))
      .attr('y', (d, i, nodes) => {
        const node = nodes[i] as SVGRectElement;
        const parent = node.parentNode as SVGGElement | null;

        if (parent) {
          const bandWidth = yScale.bandwidth() / parent.childElementCount;
          return yScale.bandwidth() / 22 + i * bandWidth;
        }
        return '0';
      })
      .attr('height', (d, i, nodes) => {
        const node = nodes[i] as SVGRectElement;
        const parent = node.parentNode as SVGGElement | null;
        if (parent) {
          const bandWidth = yScale.bandwidth() / parent.childElementCount;
          return bandWidth / 1;
        }
        return '0';
      })
      .attr('width', 0)
      .style('fill', (d, i) => colorScale(i.toString()))
      .on('mouseover', (event, d) => {
        const groupData = d3
          .select<SVGGElement, DataItem>(event.target.parentNode as SVGGElement)
          .datum();
        const xPos = event.offsetX;
        const yPos = event.offsetY;
        setTooltipState({
          position: { x: xPos, y: yPos },
          content: `${d.key} - ${d.value.toFixed(0)}%`,
          group: groupData.option_en as string,
        });
      })
      .on('mousemove', (event) => {
        const xPos = event.offsetX;
        const yPos = event.offsetY;
        setTooltipState((prevTooltipState) => ({
          ...prevTooltipState,
          position: { x: xPos, y: yPos },
        }));
      })
      .on('mouseout', () => {
        setTooltipState({ ...tooltipState, position: null });
      })
      .transition()
      .duration(duration)
      .delay((d, i) => i * (duration / 10))
      .attr('x', xScale(0))
      .attr('width', (d) => xScale(d.value) - xScale(0));
  }, [width, height, parsedData, activeFile]);
  return (
    <Container>
      <div className='container padding'>
        <Heading level={1}>Survey Findings</Heading>
      </div>

      <div className='container' ref={containerRef}>
        <Heading level={5} color='font.inverse' textAlign='center'>
          What makes an organization/company the most attractive to work for?
        </Heading>
        <Flex justifyContent='center'>
          <Button
            variation='primary'
            onClick={() => setActiveFile('org-attractive-gender.csv')}
          >
            By Gender
          </Button>
          <Button
            variation='primary'
            onClick={() => setActiveFile('org-attractive-cluster.csv')}
          >
            By Cluster
          </Button>
          <Button
            variation='primary'
            onClick={() => setActiveFile('org-attractive-city.csv')}
          >
            By City
          </Button>
        </Flex>
        <svg ref={ref}></svg>
        {tooltipState.position && (
          <Tooltip
            x={tooltipState.position.x}
            content={tooltipState.content}
            y={tooltipState.position.y}
            group={tooltipState.group}
          />
        )}
      </div>
    </Container>
  );
};

export default BarChart;
