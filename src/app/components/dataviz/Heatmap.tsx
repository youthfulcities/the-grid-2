'use client';

import { Placeholder, Text } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import HeatmapTooltip from './HeatmapTooltip';

// const topicDesc = {
//   "Good Jobs": "This means work that is meaningful, successful, relevant to your field of study, that pays you fairly, and is safe in your city.",

// "Affordability": "This means higher income and lower cost of living in your city."

// "Education and skills development": "This means access to post-secondary institutions and training opportunities, as well as affordable education support (such as tutors) in your city.",

// "Local Economic Growth": "This means positive economic growth for the stability and security of people in your city.
// "Entrepreneurial Spirit": "This means the city is innovative, creative, adaptable, and resourceful and supports entrepreneurship.",
// "Climate Change": "This means the city addresses issues related to the environment, pollution, and sustainability."

// "Digital Transformation": "This means the city provides access to reliable technology (e.g., computers), digital infrastructure (e.g. free public wifi), platforms (e.g. free, open data apps), etc.",

// "Mental Health": "This means the city provides access to mental health information, as well as, reliable and affordable mental health services."

// "Transportation": "This means the city provides accessible, reliable, and affordable buses, trains, bicycle paths, and alternative transportation methods."

// "Equity Diversity and Inclusion": "This means the city is welcoming, safe, and representative of the diversity of cultures who live there, with public services that include the needs of different people."

// "Indigenous peoples, world views, Truth & Reconciliation": "This means the city meaningfully integrates the knowledge, practices, experiences, and perspectives of Indigenous peoples and highlights the importance of building renewed relationships based on the recognition of rights, respect, and reciprocity."

// }

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  cluster?: string;
  child?: ReactNode | null;
  minWidth?: number | null;
}

interface DataItem {
  [key: string]: string | number;
}

interface HeatmapProps {
  width: number;
  height: number;
  activeFile: string;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

const ChartContainer = styled.div`
  overflow: visible;
  position: relative;
`;

const SmallText = styled(Text)`
  margin: 0;
  color: var(--amplify-colors-font-inverse);
  font-weight: 400;
  font-size: var(--amplify-font-sizes-small);
`;

const truncateText = (text: string, maxLength: number) => {
  // Remove anything within parentheses and the parentheses themselves
  const cleanedText = text.replace(/\(.*?\)/g, '').trim();

  // Truncate the text if it exceeds the maxLength
  if (cleanedText.length > maxLength) {
    return cleanedText.slice(0, maxLength) + '...';
  }

  return cleanedText;
};

const Heatmap: React.FC<HeatmapProps> = ({
  width,
  activeFile,
  tooltipState,
  setTooltipState,
}) => {
  const height = 400;
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<{ [key: string]: DataItem[] }>(
    {}
  );

  const margin = { top: 50, right: 80, bottom: 0, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    const fetchData = async (filename: string) => {
      if (Object.prototype.hasOwnProperty.call(rawData, filename)) return;
      try {
        setLoading(true);
        const downloadResult = await downloadData({
          path: `public/${filename}`,
        }).result;
        const text = await downloadResult.body.text();
        setRawData({ ...rawData, [filename]: text });
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
          Value: +d.Value, // Convert the "Value" string to a number
        };
        return row;
      });

      setParsedData({ ...parsedData, [filename]: parsed });
    };

    fetchData(activeFile);
    if (rawData[activeFile])
      parseDynamicCSVData(activeFile, rawData[activeFile]);
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

      const svg = d3
        .select(ref.current)
        .attr('width', width)

        .attr('height', height);

      // Remove existing elements before redrawing
      svg.selectAll('*').remove();

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // X axis (Topic)
      const x = d3
        .scaleBand()
        .range([0, innerWidth])
        .domain(topics)
        .padding(0.05);

      // Y axis (Cluster)
      const y = d3
        .scaleBand()
        .range([innerHeight, 0])
        .domain(clusters)
        .padding(0.05);

      g.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('fill', 'white') // Set text color to white
        .style('font-size', '12px') // Optional: Adjust font size
        .attr('transform', 'rotate(-90)') // Rotate the text
        .attr('dy', '-1em')
        .style('text-anchor', 'middle'); // Center the text

      // Set the axis lines and ticks to white
      g.selectAll('.domain').style('stroke', 'white');
      g.selectAll('.tick line').style('stroke', 'white');

      const colorScale = d3
        .scaleSequential(d3.interpolateRdYlBu)
        .domain([-40, 40]);

      // Add vertical legend on the right side
      const legendWidth = 20;
      const legendPadding = 10;
      const legendHeight = innerHeight - 2 * legendPadding;
      const chunks = 10; // Number of chunks/segments
      const currentMinValue = d3.min(data, (d) => d.Value as number) || 0;
      const currentMaxValue = d3.max(data, (d) => d.Value as number) || 100;

      const legend = svg
        .append('g')
        .attr(
          'transform',
          `translate(${width - margin.right + 20}, ${margin.top})`
        );

      const quantizedValues = d3.quantize(
        d3.interpolate(currentMaxValue, currentMinValue),
        chunks
      );

      const legendScale = d3
        .scaleLinear()
        .domain([currentMinValue, currentMaxValue])
        .rangeRound([legendHeight, 0]);

      const chunkHeight = legendHeight / chunks; // Calculate height for each chunk

      // Add rectangles for legend
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
        .style('stroke', 'black'); // Add a stroke for better visibility

      // Add legend axis
      legend
        .append('g')
        .attr('transform', `translate(${legendWidth}, ${legendPadding})`) // Adjust position of the axis
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
        .style('fill', 'white');

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

      const mouseleave = () => {
        setTooltipState({
          position: null,
          value: null,
          content: '',
          group: '',
          topic: '',
          child: null,
          minWidth: 0,
        });
      };

      g.selectAll()
        .data(data, (d) =>
          d ? `${d.Cluster as string}:${d.Topic as string}` : ''
        )
        .join('rect')
        .attr('x', (d) => x(d.Topic as string) ?? '')
        .attr('y', (d) => y(d.Cluster as string) ?? '')
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', (d) => colorScale(d.Value as number))
        .style('stroke-width', 4)
        .style('stroke', 'none')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseleave);

      // Add text labels on the bars
      g.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', (d) => {
          const xPos = x(d.Topic as string);
          return xPos != null ? xPos + x.bandwidth() / 2 : 0; // Use 0 as a fallback if xPos is undefined
        })
        .attr('y', (d) => {
          const yPos = y(d.Cluster as string);
          return yPos != null ? yPos + y.bandwidth() / 2 : 0; // Use 0 as a fallback if yPos is undefined
        })
        .attr('dy', '.35em')
        .attr('transform', (d) => {
          const xPosition = (x(d.Topic as string) ?? 0) + x.bandwidth() / 2;
          const yPosition = (y(d.Cluster as string) ?? 0) + y.bandwidth() / 2;
          return `rotate(-90, ${xPosition}, ${yPosition})`;
        })
        .text((d) => truncateText(d.Topic as string, 50)) // Truncate if needed
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseleave);
    }
    // Use requestAnimationFrame to ensure rendering is complete before setting loading to false
    requestAnimationFrame(() => {
      setLoading(false);
    });
  }, [width, height, parsedData]);

  return (
    <>
      <Placeholder height={height} isLoaded={!loading || false} />
      <ChartContainer>
        <svg ref={ref}></svg>
      </ChartContainer>
    </>
  );
};

export default Heatmap;
