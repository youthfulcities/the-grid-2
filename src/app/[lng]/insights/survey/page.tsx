'use client';

import Container from '@/app/components/Background';
import { useDimensions } from '@/hooks/useDimensions';
// import fetchFile from './fetchFile';
import { getUrl } from 'aws-amplify/storage';
import { useEffect, useRef, useState } from 'react';

// interface DataItem {
//   year: number;
//   value: number;
// }

function BarChart({ yAxisTitle = 'Test' }: { yAxisTitle?: string }) {
  const margin = {
    top: 60,
    bottom: 100,
    left: 80,
    right: 40,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const chartSize = useDimensions(containerRef);
  const { width, height } = chartSize;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const ref = useRef<SVGSVGElement>(null);

  const [signedUrl, setSignedUrl] = useState<{
    url: URL;
    expiresAt: Date;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFile = async (filename: string) => {
    try {
      const getUrlResult = await getUrl({
        path: `public/${filename}`,
        options: {
          validateObjectExistence: true,
          expiresIn: 20,
          useAccelerateEndpoint: false,
        },
      });

      return getUrlResult;
    } catch (error) {
      console.error('Error fetching URL:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUrl = async () => {
      setLoading(true);
      const urlResult = await fetchFile('org-attractive-gender.csv');
      if (urlResult) {
        setSignedUrl(urlResult);
      }
      setLoading(false);
    };

    fetchUrl();
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (width && height && signedUrl) {
      d3.csv(signedUrl.url.toString()).then(
        (csvData: d3.DSVRowArray<string>) => {
          const data: DataItem[] = csvData.map((row) => ({
            year: +row.year,
            value: +row.value,
          }));

          const sortedData = data.sort((a, b) => b.value - a.value);

          const svg = d3
            .select(ref.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
          draw(sortedData);
        }
      );
    }
  }, [width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (data: DataItem[]) => {
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.year.toString()))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)!])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(ref.current);
    const chart = svg.select('g');

    // Update bars
    const bars = chart
      .selectAll<SVGRectElement, DataItem>('.bar')
      .data(data, (d) => d.year.toString());

    bars.exit().remove();

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.year.toString())!)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .style('fill', (d, i) => colorScale(i.toString()))
      .merge(bars)
      .transition()
      .duration(500)
      .delay((d, i) => (i * 500) / 10)
      .attr('height', (d) => innerHeight - yScale(d.value))
      .attr('y', (d) => yScale(d.value));

    // Update bar labels
    const labels = chart
      .selectAll<SVGTextElement, DataItem>('.bar-label')
      .data(data, (d) => d.year.toString());

    labels.exit().remove();

    labels
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('text-anchor', 'middle')
      .attr('dx', 0)
      .attr('y', innerHeight)
      .attr('dy', -6)
      .attr('opacity', 0)
      .text((d) => d.value.toFixed(2))
      .merge(labels)
      .transition()
      .duration(500)
      .delay((d, i) => (i * 500) / 10)
      .attr('opacity', 1)
      .attr('x', (d) => xScale(d.year.toString())! + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.value) - 6);

    const xAxis = d3.axisBottom<string>(xScale); // Specify axis type here

    chart
      .selectAll('.x.axis')
      .data([null])
      .join('g')
      .classed('x axis', true)
      .attr('transform', `translate(0,${innerHeight})`)
      .transition()
      .duration(500)
      .call(xAxis as any);

    const yAxis = d3.axisLeft(yScale).ticks(5);

    chart
      .selectAll('.y.axis')
      .data([null])
      .join('g')
      .classed('y axis', true)
      .attr('transform', 'translate(0,0)')
      .transition()
      .duration(500)
      .call(yAxis as any);

    chart
      .selectAll('.x-axis-title')
      .data(['Year'])
      .join('text')
      .classed('x-axis-title', true)
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 60)
      .attr('fill', '#000')
      .style('font-size', '20px')
      .style('text-anchor', 'middle')
      .text((d) => d);

    chart
      .selectAll('.y-axis-title')
      .data([yAxisTitle])
      .join('text')
      .classed('y-axis-title', true)
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', `translate(-50, ${innerHeight / 2}) rotate(-90)`)
      .attr('fill', '#000')
      .style('font-size', '20px')
      .style('text-anchor', 'middle')
      .text((d) => d);
  };

  return (
    <Container>
      <div
        style={{ height: '100%' }}
        className='short-container'
        ref={containerRef}
      >
        <svg ref={ref}></svg>
      </div>
    </Container>
  );
}

export default BarChart;
