'use client';

import { Placeholder, Text } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import _ from 'lodash';
import
  {
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useRef,
    useState,
  } from 'react';
import styled from 'styled-components';

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
  activeFile: string;
  setTooltipState: Dispatch<SetStateAction<TooltipState>>;
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

const IndexHeatmap: React.FC<HeatmapProps> = ({
  width,
  activeFile,
  setTooltipState,
}) => {
  const height = 900;
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<{ [key: string]: DataItem[] }>(
    {}
  );

  const margin = { top: 50, right: 80, bottom: 100, left: 140 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

const calculateAndSortCityScores = (data: DataItem[]) => {
  // Step 1: Use reduce to accumulate the total score for each city and topic combination
  const cityTopicScores = data.reduce(
    (acc, curr) => {
      const score =
        (curr.normalizedScore as number) * (curr.topicWeight as number);

      // Create a unique key for each city and topic combination
      const key = `${curr.cityGroup as string}:${curr.topicEN as string}`;

      // Check if the key already exists in the accumulator
      if (!acc[key]) {
        acc[key] = {
          ...curr, // Preserve all original data
          totalScore: 0, // Initialize totalScore
        };
      }

      // Add the score to the existing total score
      acc[key].totalScore += score;

      return acc;
    },
    {} as { [key: string]: DataItem & { totalScore: number } }
  );

  // Step 2: Convert the accumulated object to an array and sort it by totalScore
  const sortedCityScores = _.orderBy(
    Object.values(cityTopicScores),
    'totalScore',
    'desc'
  );

  console.log(sortedCityScores);
  return sortedCityScores;
};

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
          topicEN: d['Topic EN'],
          cityGroup: d['City Group'],
          normalizedScore: +d['Normalized Score'],
          rank: +d.Rank,
          topicWeight: +d['Topic Weight'],
          weightedNormalizedScore: +d['Weighted Normalized Score'],
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
      const data = calculateAndSortCityScores(parsedData[activeFile]);

      const topics: string[] = [
        ...new Set(data.map((d) => d.topicEN.toString())),
      ];
      const cities: string[] = [
        ...new Set(data.map((d) => d.cityGroup.toString())),
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

      g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`) // Place the x-axis at the bottom
        .call(d3.axisBottom(x)) // Draw the bottom x-axis
        .selectAll('text')
        .style('fill', 'white') // Set text color
        .style('font-size', '12px') // Optional: Adjust font size
        .attr('transform', 'rotate(-45)') // Rotate if labels are long
        .style('text-anchor', 'end') // Align the text at the end for readability
        .text((d) => truncateText(d, 20)); // Truncate city labels

      // Y axis (City)
      const y = d3
        .scaleBand()
        .range([innerHeight, 0])
        .domain(cities)
        .padding(0.05);

      g.append('g')
        .call(d3.axisLeft(y)) // Draw the left y-axis
        .selectAll('text')
        .style('fill', 'white') // Set text color
        .style('font-size', '12px') // Optional: Adjust font size
        .style('text-anchor', 'end') // Align the text at the end
        .text((d) => truncateText(d, 20)); // Truncate city labels;

      // Set the axis lines and ticks to white
      g.selectAll('.domain').style('stroke', 'white');
      g.selectAll('.tick line').style('stroke', 'white');

      const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateRainbow)
        .domain([0, 100]);

      // Add vertical legend on the right side
      const legendWidth = 20;
      const legendPadding = 10;
      const legendHeight = innerHeight - 2 * legendPadding;
      const chunks = 10; // Number of chunks/segments
      const currentMinValue =
        d3.min(data, (d) => d.weightedNormalizedScore as number) || 0;
      const currentMaxValue =
        d3.max(data, (d) => d.weightedNormalizedScore as number) || 100;

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

      const chunkHeight = legendHeight / chunks;

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
        .style('stroke', 'black');

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
              const formattedValue = `${Math.round(d as number)}`;
              return (d as number) >= 0 ? `${formattedValue}` : formattedValue;
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
          cluster: d.cityGroup as string,
          topic: d.topicEN as string,
          value: d.rank as number,
          minWidth: 200,
        }));
      };

      const mousemove = (event: MouseEvent, d: DataItem) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState((prevTooltipState) => ({
          ...prevTooltipState,
          position: { x: xPos, y: yPos },
          cluster: d.cityGroup as string,
          topic: d.topicEN as string,
          value: d.rank as number,
          minWidth: 200,
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
          d ? `${d.cityGroup as string}:${d.topicEN as string}` : ''
        )
        .join('rect')
        .attr('x', (d) => x(d.topicEN as string) ?? '')
        .attr('y', (d) => y(d.cityGroup as string) ?? '')
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', (d) => colorScale(d.weightedNormalizedScore as number))
        .style('stroke-width', 4)
        .style('stroke', 'none')
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

export default IndexHeatmap;
