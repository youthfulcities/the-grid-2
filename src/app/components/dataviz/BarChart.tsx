'use client';

import { Placeholder } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import BarChartTooltip from './BarChartTooltip';
import Customize from './Customize';
import Legend from './Legend';

interface DataItem {
  option_en: string;
  [key: string]: string | number;
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
  height: number;
  margin: { top: number; bottom: number; left: number; right: number };
  duration: number;
  activeFile: string;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

const ChartContainer = styled.div`
  position: relative;
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

const BarChart: React.FC<BarProps> = ({
  width,
  height,
  margin,
  duration,
  activeFile,
  tooltipState,
  setTooltipState,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<{ [key: string]: DataItem[] }>(
    {}
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const [activeLegendItems, setActiveLegendItems] = useState<string[]>([]);

  const dataString = JSON.stringify(parsedData);
  const testData = d3.hierarchy(dataString);
  console.log(testData.data);

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
        setLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setLoading(false);
      }
    };

    const parseDynamicCSVData = (filename: string, csvString: string) => {
      if (parsedData[filename]) return;
      setLoading(true);
      const parsed = d3.csvParse(csvString, (d) => {
        const row: DataItem = {} as DataItem;
        Object.keys(d).forEach((oldKey) => {
          const parts = oldKey.split(/DEM_|\(SUM\)/);
          const newKey = parts.length > 1 ? parts[1] : oldKey;
          row[newKey] = Number.isNaN(+d[oldKey]) ? d[newKey] : +d[oldKey] * 100;
        });
        return row;
      });

      setParsedData({ ...parsedData, [filename]: parsed });
      setLoading(false);
    };

    fetchData(activeFile);
    if (rawData[activeFile])
      parseDynamicCSVData(activeFile, rawData[activeFile]);
  }, [activeFile, rawData, parsedData]);

  //initialize default customization options
  useEffect(() => {
    // Select the top 10 options by default when parsedData is updated
    if (parsedData[activeFile]) {
      const options = parsedData[activeFile].map((d) => d.option_en as string);
      setAllOptions(options);
      setSelectedOptions(options.slice(0, 10));

      const allKeys = Object.keys(parsedData[activeFile][0]).filter(
        (key) => key !== 'option_en'
      );
      setActiveLegendItems(allKeys.slice(0, 3));
    }
  }, [parsedData, activeFile]);

  //draw chart
  useEffect(() => {
    if (!width || !height || !parsedData[activeFile]) return;

    const data = parsedData[activeFile];
    // Extract all unique subgroup keys from the complete data
    const allKeys = Object.keys(parsedData[activeFile][0]).filter(
      (key) => key !== 'option_en'
    );

    // Filter data based on active legend items
    const dataToDisplay = data
      .filter((item) => selectedOptions.includes(item.option_en))
      .map((item) => {
        // Only include keys that are in the active legend items
        const filteredItem: Record<string, any> = { option_en: item.option_en };
        Object.keys(item).forEach((key) => {
          if (key !== 'option_en' && activeLegendItems.includes(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });

    // Calculate scales
    const yScale = d3
      .scaleBand<string>()
      .domain(dataToDisplay.map((d) => String(d.option_en)))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const maxGroupValue = d3.max(dataToDisplay, (d) =>
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

    const customLegendData = allKeys.map((item) => ({
      key: item,
      color: colorScale(item),
    }));

    setLegendData(customLegendData);

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
      .call(d3.axisLeft(yScale).tickFormat((d) => truncateText(d, 25)))
      .selectAll('text')
      .style('fill', 'white')
      .style('text-anchor', 'end')
      .attr('dy', '-0.8em')
      .attr('transform', 'rotate(-45)')
      .on('mouseover', (event, d) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState({
          position: { x: xPos, y: yPos },
          group: d as string,
        });
      })
      .on('mousemove', (event) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState((prevTooltipState) => ({
          ...prevTooltipState,
          position: { x: xPos, y: yPos },
        }));
      })
      .on('mouseout', () => {
        setTooltipState({ ...tooltipState, position: null });
      });

    // Draw bars
    const barGroups = svg
      .selectAll('.bar-group')
      .data(dataToDisplay)
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(0, ${yScale(String(d.option_en))})`);

    barGroups
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
      .style('fill', (d) => colorScale(d.key))
      .on('mouseover', (event, d) => {
        const groupData = d3
          .select<SVGGElement, DataItem>(event.target.parentNode as SVGGElement)
          .datum();
        const xPos = event.pageX;
        const yPos = event.pageY;
        setTooltipState({
          position: { x: xPos, y: yPos },
          child: (
            <BarChartTooltip
              value={d.value.toFixed(0)}
              group={d.key}
              topic={groupData.option_en}
              activeFile={activeFile}
            />
          ),
        });
      })
      .on('mousemove', (event) => {
        const xPos = event.pageX;
        const yPos = event.pageY;
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
  }, [
    width,
    height,
    parsedData,
    activeFile,
    selectedOptions,
    activeLegendItems,
  ]);

  return (
    <>
      <Placeholder height={height} isLoaded={!loading || false} />
      <ChartContainer>
        <svg ref={ref}></svg>
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
