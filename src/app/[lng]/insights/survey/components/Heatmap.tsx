'use client';

import { TooltipState } from '@/app/components/dataviz/TooltipChart/TooltipState';
import FadeInUp from '@/app/components/FadeInUp';
import { Placeholder } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import HeatmapTooltip from './HeatmapTooltip';

interface DataItem {
  [key: string]: string | number;
}

interface HeatmapProps {
  width: number;
  height: number;
  activeFile: string;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
  title: string;
}

const ChartContainer = styled.div`
  overflow: visible;
  position: relative;
`;

const margin = { top: 50, right: 80, bottom: 0, left: 30 };
const truncateText = (text: string, width: number) => {
  const cleanedText = text.replace(/\(.*?\)/g, '').trim();
  if (cleanedText.length > width / 10) {
    return `${cleanedText.slice(0, 20)}...`;
  }
  return cleanedText;
};

// Function to calculate luminance of a color
const calculateLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Function to determine if white text is better based on contrast
const shouldUseWhiteText = (color: string) => {
  const rgb = d3.rgb(color);
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  return luminance < 0.3;
};

const Heatmap: React.FC<HeatmapProps> = ({
  width,
  activeFile,
  setTooltipState,
  title,
}) => {
  const height = 400;
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<{ [key: string]: DataItem[] }>(
    {}
  );
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (filename: string) => {
      if (Object.prototype.hasOwnProperty.call(rawData, filename)) return;
      try {
        setLoading(true);
        const downloadResult = await downloadData({
          path: `public/${filename}`,
        }).result;
        const text = await downloadResult.body.text();
        if (isMounted) {
          setRawData((prev) => ({ ...prev, [filename]: text }));
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const parseDynamicCSVData = (filename: string, csvString: string) => {
      if (parsedData[filename]) return;
      setLoading(true);
      const parsed = d3.csvParse(csvString, (d) => {
        const row: DataItem = {
          Cluster: d.Cluster,
          Topic: d.Topic,
          Value: +d.Value,
        };
        return row;
      });
      if (isMounted) {
        setParsedData((prev) => ({ ...prev, [filename]: parsed }));
      }
    };

    fetchData(activeFile);
    if (rawData[activeFile])
      parseDynamicCSVData(activeFile, rawData[activeFile]);

    return () => {
      isMounted = false; // Cleanup function to avoid setting state on unmounted component
    };
  }, [activeFile, rawData, parsedData]);

  useEffect(() => {
    if (!width || !height || !parsedData[activeFile]) return;
    if (parsedData[activeFile]) {
      const data = parsedData[activeFile];
      const clusters: string[] = [
        ...new Set(data.map((d) => d.Cluster.toString())),
      ];
      const topics: string[] = [
        ...new Set(data.map((d) => d.Topic.toString())),
      ];

      const mouseleave = () => {
        setTooltipState({
          position: null,
        });
      };

      const svg = d3
        .select(ref.current)
        .attr('width', width)
        .attr('height', height)
        .on('mouseout', mouseleave)
        .on('mouseleave', mouseleave);

      svg.selectAll('*').remove();

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .on('mouseout', mouseleave)
        .on('mouseleave', mouseleave);

      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-family', 'Gotham Narrow Medium')
        .style('fill', 'white')
        .text(title);

      const x = d3
        .scaleBand()
        .range([0, innerWidth])
        .domain(clusters)
        .padding(0.05);
      const y = d3
        .scaleBand()
        .range([0, innerHeight])
        .domain(topics)
        .padding(0);

      const colorScale = d3
        .scaleSequential(d3.interpolateRdYlBu)
        .domain([-40, 40]);

      const legendWidth = 20;
      const legendPadding = 10;
      const legendHeight = innerHeight - 2 * legendPadding;
      const chunks = 10;
      const currentMinValue = d3.min(data, (d) => d.Value as number) || 0;
      const currentMaxValue = d3.max(data, (d) => d.Value as number) || 100;

      const legend = svg
        .append('g')
        .attr(
          'transform',
          `translate(${width - margin.right + 20}, ${margin.top})`
        );

      const quantizedValues = d3.quantize(
        d3.interpolate(currentMinValue, currentMaxValue),
        chunks
      );
      const legendScale = d3
        .scaleLinear()
        .domain([currentMaxValue, currentMinValue])
        .rangeRound([legendHeight, 0]);
      const chunkHeight = legendHeight / chunks;

      legend
        .selectAll('rect')
        .data(quantizedValues)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * chunkHeight + legendPadding)
        .attr('width', legendWidth)
        .attr('height', chunkHeight)
        .style('fill', (d) => colorScale(d))
        .style('stroke', 'black')
        .on('mouseout', mouseleave);

      legend
        .append('g')
        .attr('transform', `translate(${legendWidth}, ${legendPadding})`)
        .call(
          d3
            .axisRight(legendScale)
            .tickSize(10)
            .tickValues(quantizedValues)
            .tickFormat((d) => {
              const formattedValue = `${Math.round(d as number)}%`;
              return (d as number) >= 0 ? `+${formattedValue}` : formattedValue;
            })
        )
        .selectAll('text')
        .style('fill', 'white')
        .on('mouseout', mouseleave);

      const mouseover = (event: MouseEvent, d: DataItem) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState((prevTooltipState) => ({
          ...prevTooltipState,
          position: { x: xPos, y: yPos },
          cluster: d.Cluster as string,
          topic: d.Topic as string,
          value: d.Value as number,
          minWidth: 200,
          child: (
            <HeatmapTooltip
              value={d.Value as number}
              cluster={d.Cluster as string}
              topic={d.Topic as string}
            />
          ),
        }));
      };

      const mousemove = (event: MouseEvent, d: DataItem) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState((prevTooltipState) => ({
          ...prevTooltipState,
          position: { x: xPos, y: yPos },
          cluster: d.Cluster as string,
          topic: d.Topic as string,
          value: d.Value as number,
          minWidth: 200,
          child: (
            <HeatmapTooltip
              value={d.Value as number}
              cluster={d.Cluster as string}
              topic={d.Topic as string}
            />
          ),
        }));
      };

      g.selectAll()
        .data(data, (d) =>
          d ? `${d.Cluster as string}:${d.Topic as string}` : ''
        )
        .join('rect')
        .attr('x', (d) => x(d.Cluster as string) ?? '')
        .attr('y', (d) => y(d.Topic as string) ?? '')
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', (d) => colorScale(d.Value as number))
        .style('stroke-width', 4)
        .style('stroke', 'none')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseleave)
        .on('mouseleave', mouseleave);

      g.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', (d) => {
          const xPos = x(d.Cluster as string);
          return xPos != null ? xPos + x.bandwidth() / 2 : 0;
        })
        .attr('y', (d) => {
          const yPos = y(d.Topic as string);
          return yPos != null ? yPos + y.bandwidth() / 2 : 0;
        })
        .attr('dy', '.35em')
        .text((d) => truncateText(d.Topic as string, width))
        .style('fill', (d) => {
          const barColor = colorScale(d.Value as number);
          return shouldUseWhiteText(barColor) ? 'white' : 'black';
        })
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove);
    }
    requestAnimationFrame(() => {
      setLoading(false);
    });
  }, [
    width,
    height,
    parsedData,
    activeFile,
    innerHeight,
    innerWidth,
    margin,
    title,
  ]);

  return (
    <FadeInUp>
      <Placeholder height={height} isLoaded={!loading || false} />
      <ChartContainer>
        <svg ref={ref} data-testid='heatmap' />
      </ChartContainer>
    </FadeInUp>
  );
};

export default Heatmap;
