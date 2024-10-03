'use client';

import {
  Button,
  Flex,
  Placeholder,
  SliderField,
  Text,
} from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import _ from 'lodash';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import Drawer from '../Drawer';

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

const CustomSliderField = styled(SliderField)`
  width: 100%;
`;

// Define the type for the topic weights
interface TopicWeights {
  [key: string]: {
    title: string;
    weight: number;
  };
}
const topicWeights: TopicWeights = {
  AFF: {
    title: 'Affordability',
    weight: 0.88,
  },
  CEC: {
    title: 'City Economy',
    weight: 0.81,
  },
  SUS: {
    title: 'Climate Action',
    weight: 0.8,
  },
  DAC: {
    title: 'Digital Access',
    weight: 0.77,
  },
  EDU: {
    title: 'Education + Skills',
    weight: 0.83,
  },
  ENS: {
    title: 'Entrepreneurial Spirit',
    weight: 0.73,
  },
  EDI: {
    title: 'Equity, Diversity, and Inclusion',
    weight: 0.82,
  },
  GYJ: {
    title: 'Good Youth Jobs',
    weight: 0.87,
  },
  HEA: {
    title: 'Health',
    weight: 0.85,
  },
  TRA: {
    title: 'Transportation',
    weight: 0.85,
  },
};

const topicWeightsArray = Object.entries(topicWeights).map(([key, value]) => ({
  code: key,
  title: value.title,
  weight: value.weight,
}));

// List of city groups to which the 10% penalty should be applied
// const penaltyCityGroups = [
//   'Vancouver',
//   'Ottawa-Gatineau',
//   'Victoria',
//   'Kitchener - Cambridge - Waterloo',
//   'St. Catharines - Niagara',
// ];

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
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<{ [key: string]: DataItem[] }>(
    {}
  );
  const [sortedData, setSortedData] = useState<
    { cityGroup: string; totalScore: number }[]
  >([]);
  const [customWeights, setCustomWeights] =
    useState<TopicWeights>(topicWeights);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [distanceFromRight, setDistanceFromRight] = useState<number>(0);

  const margin = { top: 50, right: 80, bottom: 100, left: 140 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Memoize distanceFromRight calculation to avoid unnecessary re-renders
  const memoizedDistanceFromRight = useMemo(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return window.innerWidth - rect.right;
    }
    return 0;
  }, [width]); // Only recalculate when width changes

  // Sync the memoized distanceFromRight with the state
  useEffect(() => {
    setDistanceFromRight(memoizedDistanceFromRight);
  }, [memoizedDistanceFromRight]);

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

    const parseDynamicCSVData = (
      filename: string,
      csvString: string,
      isPivot: boolean = false
    ) => {
      if (parsedData[filename]) return;
      setLoading(true);
      const parsed = d3.csvParse(csvString, (d) => {
        const row: DataItem = isPivot
          ? {
              cityGroup: d['City Group'],
              AFF: +d.Affordability_Normalized_Score,
              CEC: +d['City Economy_Normalized_Score'],
              SUS: +d['Climate Action_Normalized_Score'],
              DAC: +d['Digital Access_Normalized_Score'],
              EDU: +d['Education + Skills_Normalized_Score'],
              ENS: +d['Entrepreneurial Spirit_Normalized_Score'],
              EDI: +d['Equity, diversity, and Inclusion_Normalized_Score'],
              GYJ: +d['Good Youth Jobs_Normalized_Score'],
              HEA: +d.Health_Normalized_Score,
              TRA: +d.Transportation_Normalized_Score,
            }
          : {
              topicEN: d['Topic EN'],
              code: d.Topic_Short,
              cityGroup: d['City Group'],
              normalizedScore: +d['Normalized Score'],
              rank: +d.Rank,
              topicWeight: +d['Topic Weight'],
              weightedNormalizedScore: +d['Proportional Weighted Score'],
            };
        return row;
      });

      setParsedData({ ...parsedData, [filename]: parsed });
    };

    fetchData(activeFile);
    fetchData('heatmap_pivot.csv');
    if (rawData[activeFile])
      parseDynamicCSVData(activeFile, rawData[activeFile], false);

    if (rawData['heatmap_pivot.csv']) {
      parseDynamicCSVData(
        'heatmap_pivot.csv',
        rawData['heatmap_pivot.csv'],
        true
      );
    }
  }, [activeFile, rawData, parsedData]);

  useEffect(() => {
    const calcScores = () => {
      const data = parsedData['heatmap_pivot.csv'];
      if (!data) return;

      const keys = Object.keys(customWeights);

      // Initialize an accumulator for total scores
      const totalScores = data.reduce(
        (acc, row) => {
          // Calculate weighted scores and initialize total score for the cityGroup
          const cityGroup = row.cityGroup as string;

          // Calculate weighted scores for the current row
          const weightedScore = keys.reduce((sum, key) => {
            const value = row[key] as number;
            const weight = customWeights[key].weight;

            if (value !== undefined && weight !== undefined) {
              // Accumulate weighted score
              return sum + value * weight;
            }
            return sum; // If no value or weight, return the sum as is
          }, 0);

          // If cityGroup doesn't exist, initialize it
          if (!acc[cityGroup]) {
            acc[cityGroup] = { cityGroup, totalScore: 0 };
          }

          // Apply penalty if cityGroup is in penaltyCityGroups
          // if (penaltyCityGroups.includes(cityGroup)) {
          //   acc[cityGroup].totalScore += weightedScore * 0.9; // Reduce score by 10%
          // } else {
          //   acc[cityGroup].totalScore += weightedScore;
          // }

          acc[cityGroup].totalScore += weightedScore;

          return acc; // Return the accumulator for the next iteration
        },
        {} as Record<string, { cityGroup: string; totalScore: number }>
      );

      const sorted = _.orderBy(totalScores, ['totalScore'], ['desc']);
      setSortedData(sorted);
    };
    if (parsedData['heatmap_pivot.csv']) {
      calcScores();
    }
  }, [parsedData, customWeights]);

  const selectTopic = (code: string) => {
    setCustomWeights((prevWeights) => {
      // Create a new weights object with all weights set to 0
      const updatedWeights: TopicWeights = Object.fromEntries(
        Object.keys(prevWeights).map((currCode) => [
          currCode,
          { ...prevWeights[currCode], weight: 0 }, // Set all weights to 0
        ])
      );

      // Set the weight for the selected code to 1
      if (updatedWeights[code]) {
        updatedWeights[code].weight = 1; // Set weight to 1 for the selected code
      }

      return updatedWeights; // Return the updated weights object
    });
  };

  useEffect(() => {
    if (!width || !height || !parsedData[activeFile] || !sortedData) return;

    if (parsedData[activeFile] && sortedData) {
      const scoreMap = Object.fromEntries(
        sortedData.map(({ cityGroup, totalScore }) => [cityGroup, totalScore])
      );

      // Sort the data based on the totalScore using d3.sort
      const sortedParsedData = d3.sort(parsedData[activeFile], (a, b) => {
        const scoreA = scoreMap[a.cityGroup] || 0; // Fallback to 0 if cityGroup not found
        const scoreB = scoreMap[b.cityGroup] || 0; // Fallback to 0 if cityGroup not found
        return d3.descending(scoreB, scoreA); // Sort in ascending order
      });

      const data = sortedParsedData || parsedData[activeFile];

      const topics: string[] = [
        ...new Set(data.map((d) => d.topicEN.toString())),
      ];
      const cities: string[] = [
        ...new Set(data.map((d) => d.cityGroup.toString())),
      ];

      // Clear previous content before drawing the new chart
      d3.select(ref.current).selectAll('*').remove();

      const svg = d3
        .select(ref.current)
        .attr('width', width)
        .attr('height', height);

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
        .html(
          (d) =>
            `<i class="fa fa-star">Hello</i> ${truncateText(d as string, 20)}`
        );

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
        .text((d) => truncateText(d as string, 20)); // Truncate city labels;

      // Set the axis lines and ticks to white
      g.selectAll('.domain').style('stroke', 'white');
      g.selectAll('.tick line').style('stroke', 'white');

      const currentMinValue =
        d3.min(data, (d) => d.normalizedScore as number) || 0;
      const currentMaxValue =
        d3.max(data, (d) => d.normalizedScore as number) || 100;

      const colorScale = d3
        .scaleSequential()
        .domain([currentMinValue, currentMaxValue])
        .interpolator(
          d3.piecewise(d3.interpolateHsl, [
            '#F2695D',
            '#FBD166',
            '#B8D98D',
            '#178749',
          ])
        );

      // Add vertical legend on the right side
      const legendWidth = 20;
      const legendPadding = 10;
      const legendHeight = innerHeight - 2 * legendPadding;
      const chunks = 11; // Number of chunks/segments

      const quantizedValues = d3.quantize(
        d3.interpolate(currentMaxValue, currentMinValue),
        chunks
      );

      const legend = svg
        .append('g')
        .attr(
          'transform',
          `translate(${width - margin.right + 20}, ${margin.top})`
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
          content: `${d.cityGroup} is #${d.rank} in ${d.topicEN} with a score of ${Number(d.normalizedScore).toFixed(1)}.`,
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

      g.selectAll<SVGRectElement, DataItem>('rect')
        .data(data, (d) => `${d.cityGroup as string}:${d.topicEN as string}`)
        .join(
          (enter) => {
            // Enter selection: create new rectangles
            const rect = enter
              .append('rect')
              .attr('x', (d) => x(d.topicEN as string) ?? '')
              .attr('y', (d) => y(d.cityGroup as string) ?? '')
              .attr('width', x.bandwidth())
              .attr('height', y.bandwidth())
              .style('fill', (d) => colorScale(d.normalizedScore as number))
              .style('stroke-width', 4)
              .style('stroke', 'none')
              .style('cursor', 'pointer')
              .on('mouseover', mouseover)
              .on('mousemove', mousemove)
              .on('mouseout', mouseleave)
              .on('click', (event, d) => selectTopic(d.code as string));

            return rect; // Return the new rectangles
          },
          (update) => {
            // Update selection: update existing rectangles
            update
              .attr('x', (d) => x(d.topicEN as string) ?? '')
              .attr('y', (d) => y(d.cityGroup as string) ?? '')
              .attr('width', x.bandwidth())
              .attr('height', y.bandwidth())
              .style('fill', (d) => colorScale(d.normalizedScore as number))
              .style('cursor', 'pointer')
              .on('click', (event, d) => {
                selectTopic(d.code as string);
              });

            return update; // Return the updated rectangles
          },
          (exit) => {
            // Exit selection: remove rectangles that no longer have data
            exit
              .transition()
              .duration(200) // Optional: add a transition effect
              .style('opacity', 0) // Fade out before removing
              .remove(); // Remove the element from the DOM
          }
        );
    }
    // Use requestAnimationFrame to ensure rendering is complete before setting loading to false
    requestAnimationFrame(() => {
      setLoading(false);
    });
  }, [width, height, parsedData, sortedData]);

  const handleChange = (value: number, code: string) => {
    setCustomWeights({
      ...customWeights,
      [code]: {
        ...customWeights[code],
        weight: value / 100,
      },
    });
  };

  const handleReset = () => {
    setCustomWeights(topicWeights);
  };

  return (
    <>
      <Placeholder height={height} isLoaded={!loading || false} />
      <ChartContainer ref={containerRef}>
        <svg ref={ref}></svg>
        <Drawer
          noOverlay
          absolute
          translate={distanceFromRight}
          isopen={isDrawerOpen}
          onOpen={() => setIsDrawerOpen(true)}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          tabText={
            <Text marginTop='medium' marginLeft='xs'>
              Customize the results
            </Text>
          }
        >
          <Flex direction='column'>
            <Text>
              Adjust the weights of each topic depending on how important each
              one is to you and watch the ranking change on the heatmap. A
              weight of 100 represents "extremely important" and a 0 represents
              "not a priority". Currently your best city is{' '}
              <strong>{sortedData[0]?.cityGroup}</strong>.
            </Text>
            <SmallText marginBottom='xl'>
              The default weights are based on average importance ratings
              assigned to each topic based on over 1500 respondents to the
              "What's up with work, lately" survey 2024. These weights influence
              the proportional contribution of each topic to the final score in
              determining the Best Work City.
            </SmallText>
            {topicWeightsArray.map((topic) => (
              <CustomSliderField
                label={topic.title}
                value={customWeights[topic.code].weight * 100}
                onChange={(value) => handleChange(value, topic.code)}
                formatValue={() => (
                  <Text marginBottom='0'>
                    {(customWeights[topic.code].weight * 100).toFixed(0)}
                  </Text>
                )}
              />
            ))}
            <Button onClick={handleReset} variation='primary' marginTop='xl'>
              Reset
            </Button>
          </Flex>
        </Drawer>
      </ChartContainer>
    </>
  );
};

export default IndexHeatmap;
