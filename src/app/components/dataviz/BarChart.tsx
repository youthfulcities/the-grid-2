'use client';

import { Placeholder } from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import Customize from './Customize';
import Tooltip from './TooltipChart';

interface DataItem {
  option_en: string;
  [key: string]: string | number;
}

interface BarProps {
  width: number;
  height: number;
  margin: { top: number; bottom: number; left: number; right: number };
  duration: number;
  activeFile: string;
}

const BarChart: React.FC<BarProps> = ({
  width,
  height,
  margin,
  duration,
  activeFile,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<{ [key: string]: DataItem[] }>(
    {}
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [allOptions, setAllOptions] = useState<string[]>([]);

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

  useEffect(() => {
    // Select the top 10 options by default when parsedData is updated
    if (parsedData[activeFile]) {
      const options = parsedData[activeFile].map((d) => d.option_en as string);

      setAllOptions(options);
      setSelectedOptions(options.slice(0, 10));
    }
  }, [parsedData, activeFile]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    if (!width || !height || !parsedData[activeFile]) return;

    const data = parsedData[activeFile];
    const dataToDisplay = data.filter((item) =>
      selectedOptions.includes(item.option_en)
    );

    console.log(dataToDisplay);

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
        const xPos = event.layerX;
        const yPos = event.layerY;
        setTooltipState({
          position: { x: xPos, y: yPos },
          content: `${d.key} - ${d.value.toFixed(0)}%`,
          group: groupData.option_en as string,
        });
      })
      .on('mousemove', (event) => {
        const xPos = event.layerX;
        const yPos = event.layerY;
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

    const legendData = barGroups.data().reduce((acc, d) => {
      const keys = Object.keys(d).filter((key) => key !== 'option_en');
      keys.forEach((key) => {
        if (!acc.includes(key)) {
          acc.push(key);
        }
      });
      return acc;
    }, [] as string[]);

    const longestTextLength = Math.max(...legendData.map((d) => d.length));
    const legendItemWidth = longestTextLength * 6 + 60; // Assuming each character width is 8px

    // Create legend
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        `translate(${width - legendItemWidth}, ${height - legendData.length * 20 - 50})`
      );

    // Legend background
    // legend
    //   .append('rect')
    //   .attr('x', -10)
    //   .attr('y', -10)
    //   .attr('rx', 8)
    //   .attr('ry', 8)
    //   .attr('width', 150)
    //   .attr('height', legendData.length * 20 + 10)
    //   .style('fill', 'white')
    //   .attr('opacity', 0.9);

    // Legend items
    legend
      .selectAll('rect.legend-item')
      .data(legendData)
      .enter()
      .append('rect')
      .attr('class', 'legend-item')
      .attr('x', 0)
      .attr('y', (d, i) => i * 20)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d) => colorScale(d));

    legend
      .selectAll('text.legend-label')
      .data(legendData)
      .enter()
      .append('text')
      .attr('class', 'legend-label')
      .attr('x', 20)
      .attr('y', (d, i) => i * 20 + 9)
      .style('fill', 'white')
      .attr('font-size', '12px')
      .text((d) => d);
  }, [width, height, parsedData, activeFile, selectedOptions]);

  return (
    <>
      <Placeholder height={height} isLoaded={!loading || false} />
      <svg ref={ref}></svg>
      {tooltipState.position && (
        <Tooltip
          x={tooltipState.position.x - 130}
          content={tooltipState.content}
          y={tooltipState.position.y - 20}
          group={tooltipState.group}
        />
      )}
      <Customize
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        allOptions={allOptions}
      />
    </>
  );
};

export default BarChart;
