'use client';

import FadeInUp from '@/app/components/FadeInUp';
import { useTooltip } from '@/app/context/TooltipContext';
import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import {
  Flex,
  Heading,
  Placeholder,
  Text,
  View,
  useTheme,
} from '@aws-amplify/ui-react';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { FaBrain, FaBriefcase, FaDollarSign } from 'react-icons/fa6';
import styled from 'styled-components';
import Legend from '../../../../components/dataviz/Legend';
import Heatmap from './Heatmap';

interface DataItem {
  [key: string]: string | number;
}

interface LegendProps {
  data: Array<{ key: string; color: string }>;
}

interface ClusterProps {
  currentCluster: string;
  setCurrentCluster: (cluster: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const ChartContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const OverflowContainer = styled(View)`
  overflow: inherit;
`;
const Clusters: React.FC<ClusterProps> = ({
  currentCluster,
  setCurrentCluster,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'WUWWL_survey');
  const height = 600;
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<Record<string, DataItem[]>>({});
  const [activeFile] = useState('umap_data.csv');
  const [legendData, setLegendData] = useState<LegendProps['data']>([]);
  const [clusterNames, setClusterNames] = useState<Array<string>>([]);
  const { tokens } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useDimensions(containerRef);
  const { setTooltipState } = useTooltip();
  const width = containerWidth - 60;

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
          setRawData({ ...rawData, [filename]: text });
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const parseDynamicCSVData = (filename: string, csvString: string) => {
      if (parsedData[filename]) return;
      const parsed = d3.csvParse(csvString, (d) => {
        const row: DataItem = {};
        Object.keys(d).forEach((oldKey) => {
          const parts = oldKey.split(/DEM_|\(SUM\)/);
          const newKey = parts.length > 1 ? parts[1] : oldKey;
          row[newKey] = Number.isNaN(+d[oldKey]) ? d[newKey] : +d[oldKey];
        });

        // Rename cluster name
        if (row.Cluster_Label === 'Affordability focus') {
          row.Cluster_Label = t('cluster_economic');
        }

        if (row.Cluster_Label === 'Social good focus') {
          row.Cluster_Label = t('cluster_social');
        }

        if (row.Cluster_Label === 'Forming opinions') {
          row.Cluster_Label = t('cluster_forming');
        }
        // Safeguard against undefined labels
        const label = row.Cluster_Label
          ? String(row.Cluster_Label)
          : 'Unknown Cluster';

        // Functional state update to prevent duplicates
        setClusterNames((prevClusterNames) => {
          if (!prevClusterNames.includes(label)) {
            return [...prevClusterNames, label];
          }
          return prevClusterNames;
        });

        return row;
      });
      if (isMounted) {
        setParsedData({ ...parsedData, [filename]: parsed });
      }
    };

    fetchData(activeFile);
    if (rawData[activeFile])
      parseDynamicCSVData(activeFile, rawData[activeFile]);

    return () => {
      isMounted = false; // Cleanup function to avoid setting state on unmounted component
    };
  }, [activeFile, rawData, parsedData, lng]);

  useEffect(() => {
    if (!width || !height || !parsedData[activeFile]) return;

    setLoading(true);
    const drawChart = () => {
      if (parsedData[activeFile]) {
        const data = parsedData[activeFile];

        d3.select('#chart').selectAll('svg').remove();
        // Create SVG element
        const svg = d3
          .select('#chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        // Filter out undefined or non-numeric values for UMAP1 and UMAP2
        const filteredData = data.filter(
          (d) => typeof d.UMAP1 === 'number' && typeof d.UMAP2 === 'number'
        );

        // Compute domain for xScale and yScale
        const xMin = d3.min(filteredData, (d) => +d.UMAP1) as number; // Convert to number using +
        const xMax = d3.max(filteredData, (d) => +d.UMAP1) as number; // Convert to number using +

        const yMin = d3.min(filteredData, (d) => +d.UMAP2) as number; // Convert to number using +
        const yMax = d3.max(filteredData, (d) => +d.UMAP2) as number; // Convert to number using +

        // Create scales
        const xScale = d3
          .scaleLinear()
          .domain([xMin, xMax])
          .range([50, width - 50]);

        const yScale = d3
          .scaleLinear()
          .domain([yMin, yMax])
          .range([height - 50, 50]);

        const colorScale = d3
          .scaleOrdinal<string>()
          .domain(clusterNames)
          .range(d3.schemeCategory10);

        // Add contour density layer
        const densityData = d3
          .contourDensity<DataItem>()
          .x((d: DataItem) => xScale(d.UMAP1 as number))
          .y((d: DataItem) => yScale(d.UMAP2 as number))
          .size([width, height])
          .bandwidth(35)(filteredData);

        svg
          .append('g')
          .selectAll('path')
          .data(densityData)
          .enter()
          .append('path')
          .attr('d', d3.geoPath())
          .attr('fill', 'none')
          .attr('stroke', 'white')
          .attr('stroke-linejoin', 'round');

        // Create circles for each data point
        svg
          .selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', (d) => xScale(d.UMAP1 as number))
          .attr('cy', (d) => yScale(d.UMAP2 as number))
          .attr('r', 0)
          .attr('fill', (d) => colorScale(String(d.Cluster_Label)))
          .attr('opacity', 0)
          .transition()
          .duration(200)
          .delay((_, i) => i * 3)
          .attr('r', 5)
          .attr('opacity', (d) => {
            if (currentCluster === t('cluster_all')) {
              return 0.9;
            }
            if (d.Cluster_Label === currentCluster) {
              return 0.9;
            }
            return 0.2;
          });

        svg
          .selectAll('circle')
          .data(data)
          .on('mouseover', (event, d) => {
            d3.select(event.currentTarget).classed('hover-cursor', true);
            const xPos = event.pageX;
            const yPos = event.pageY;
            setTooltipState({
              position: { x: xPos, y: yPos },
              child: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: t('demo_cluster', {
                      value: d.Cluster_Label,
                    }),
                  }}
                />
              ),
              group: '',
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
          .on('mouseout', (event) => {
            d3.select(event.currentTarget).classed('hover-cursor', false);
            setTooltipState({ position: null });
          })
          .on('click', (event, d) => {
            event.stopPropagation();
            if (currentCluster === (d.Cluster_Label as string)) {
              setCurrentCluster(t('cluster_all')); // Reset to 'all'
              setIsDrawerOpen(!isDrawerOpen);
            } else {
              setCurrentCluster(d.Cluster_Label as string); // Set currentCluster to clicked Cluster_Label
              setIsDrawerOpen(true);
            }
          });

        svg.on('click', () => {
          setCurrentCluster(t('cluster_all')); // Reset to 'all' when clicking on SVG background
        });

        const customLegendData = colorScale.domain();

        const newLegendData = customLegendData.map((item) => ({
          key: item,
          color: colorScale(item),
        }));
        setLegendData(newLegendData);
        // Use requestAnimationFrame to ensure rendering is complete before setting loading to false
        requestAnimationFrame(() => {
          setLoading(false);
        });
      }
    };
    drawChart();
  }, [parsedData, activeFile, width, currentCluster, lng]);

  return (
    <OverflowContainer ref={containerRef}>
      <FadeInUp>
        <ChartContainer>
          <Placeholder height={height} isLoaded={!loading || false} />
          <div id='chart' data-testid='cluster-chart' />
          <Legend data={legendData} position='absolute' />
        </ChartContainer>
      </FadeInUp>
      <FadeInUp>
        <Heading
          level={4}
          color='primary.60'
          marginTop='xxl'
          marginBottom='large'
        >
          <Trans
            t={t}
            i18nKey='takeaways_title'
            components={{ span: <span className='highlight' /> }}
          />
        </Heading>
        <Flex
          direction='row'
          justifyContent='space-between'
          wrap='wrap'
          gap='medium'
          marginBottom='xl'
        >
          <Text>{t('takeaways_desc')}</Text>
          <Flex alignItems='center' justifyContent='flex-start'>
            <FaDollarSign size='50px' color={tokens.colors.primary[60].value} />
            <Text marginBottom='0'>
              <strong>{t('takeaways_aff')}</strong>
            </Text>
          </Flex>
          <Flex alignItems='center' justifyContent='flex-start'>
            <FaBrain size='50px' color={tokens.colors.primary[60].value} />
            <Text>
              <strong>{t('takeaways_mental')}</strong>
            </Text>
          </Flex>
          <Flex alignItems='center' justifyContent='flex-start'>
            <FaBriefcase size='50px' color={tokens.colors.primary[60].value} />
            <Text>
              <strong>{t('takeaways_jobs')}</strong>
            </Text>
          </Flex>
        </Flex>
      </FadeInUp>
      <Heatmap
        activeFile='cluster-heatmap-economic.csv'
        width={width}
        height={height}
        title={t('cluster_economic')}
      />
      <Heatmap
        activeFile='cluster-heatmap-forming.csv'
        width={width}
        height={height}
        title={t('cluster_forming')}
      />
      <Heatmap
        activeFile='cluster-heatmap-social.csv'
        width={width}
        height={height}
        title={t('cluster_social')}
      />
    </OverflowContainer>
  );
};

export default Clusters;
