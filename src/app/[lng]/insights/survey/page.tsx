'use client';

import Container from '@/app/components/Background';
import { useDimensions } from '@/hooks/useDimensions';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

interface DataItem {
  [key: string]: string | number;
}

const duration = 500;

const BarChart: React.FC = () => {
  const margin = {
    top: 60,
    bottom: 100,
    left: 80,
    right: 40,
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const chartSize = useDimensions(containerRef);
  const height = 800;
  const { width } = chartSize;
  const ref = useRef<SVGSVGElement>(null);
  const yAxisTitle = 'Test';
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<Record<string, DataItem[]>>({});
  const [activeFile, setActiveFile] = useState('org-attractive-gender.csv');
  const [columnToSortBy, setColumnToSortBy] = useState<string>(
    'percentage_Gender_DEM_Man (SUM)'
  );

  const fetchData = async (filename: string) => {
    if (data.hasOwnProperty(filename)) {
      return;
    }
    try {
      setLoading(true);
      const downloadResult = await downloadData({
        path: `public/${filename}`,
      }).result;
      const text = await downloadResult.body.text();
      setLoading(false);
      setData({ ...data, [filename]: text });
    } catch (error) {
      console.log('Error:', error);
      setLoading(false);
    }
  };

  const parseDynamicCSVData = (filename: string, csvString: string) => {
    if (parsedData[filename]) {
      return;
    }
    const parsed = d3.csvParse(csvString, (d) => {
      const row: DataItem = {};
      Object.keys(d).forEach((key) => {
        row[key] = isNaN(+d[key]) ? d[key] : +d[key]; // Convert numeric values to numbers
      });
      return row;
    });
    setParsedData({ ...parsedData, [filename]: parsed });
  };

  useEffect(() => {
    if (data[activeFile]) {
      parseDynamicCSVData(activeFile, data[activeFile]);
    }
  }, [data, activeFile]);

  const draw = () => {
    if (!parsedData[activeFile]) {
      return;
    }

    const sortedData = parsedData[activeFile].slice().sort((a, b) => {
      return (b[columnToSortBy] as number) - (a[columnToSortBy] as number);
    });

    const xScale = d3
      .scaleBand()
      .domain(sortedData.map((d) => Object.keys(d)[0].toString()))
      .range([0, width - margin.left - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(sortedData, (d) => parseFloat(String(Object.values(d)[1]))) || 0,
      ])
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(ref.current);
    const chart = svg.select('g');

    // Update bars
    const bars = chart
      .selectAll<SVGRectElement, DataItem>('.bar')
      .data(sortedData, (d) => String(Object.keys(d)[0]));

    bars.exit().remove();

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(String(Object.keys(d)[0]))!)
      .attr('width', xScale.bandwidth())
      .attr('y', height - margin.top - margin.bottom)
      .attr('height', 0)
      .style('fill', (d, i) => colorScale(String(i)))
      .merge(bars)
      .transition()
      .duration(duration)
      .delay((d, i) => (i * duration) / 10)
      .attr(
        'height',
        (d) =>
          height -
          margin.top -
          margin.bottom -
          yScale(parseFloat(String(Object.values(d)[1])))
      )
      .attr('y', (d) => yScale(parseFloat(String(Object.values(d)[1]))));

    // Update bar labels
    const labels = chart
      .selectAll<SVGTextElement, DataItem>('.bar-label')
      .data(sortedData, (d) => String(Object.keys(d)[0]));

    labels.exit().remove();

    labels
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('text-anchor', 'middle')
      .attr('dx', 0)
      .attr('y', height - margin.top - margin.bottom)
      .attr('dy', -6)
      .attr('opacity', 0)
      .text((d) => parseFloat(String(Object.values(d)[1])).toFixed(2))
      .merge(labels)
      .transition()
      .duration(duration)
      .delay((d, i) => (i * duration) / 10)
      .attr('opacity', 1)
      .attr(
        'x',
        (d) => xScale(String(Object.keys(d)[0]))! + xScale.bandwidth() / 2
      )
      .attr('y', (d) => yScale(parseFloat(String(Object.values(d)[1]))) - 6);

    const xAxis = d3.axisBottom(xScale);
    chart
      .select('.x.axis')
      .transition()
      .duration(duration)
      .call(xAxis as any);

    const yAxis = d3.axisLeft(yScale).ticks(5);
    chart
      .select('.y.axis')
      .transition()
      .duration(duration)
      .call(yAxis as any);

    chart.select('.x-axis-title').text('X Axis Title');

    chart.select('.y-axis-title').text('Y Axis Title');
  };

  useEffect(() => {
    if (width && height && parsedData[activeFile]) {
      const svg = d3
        .select(ref.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      draw();
    }
  }, [width, height, parsedData, activeFile]);

  return (
    <Container>
      <div className='short-container' ref={containerRef}>
        <svg ref={ref}></svg>
      </div>
      <button onClick={() => fetchData(activeFile)}>Fetch Data</button>
    </Container>
  );
};

export default BarChart;
