import BarChartStacked from '@/app/components/dataviz/BarChartStacked';
import useTranslation from '@/app/i18n/client';
import { Button, Heading, Text, View } from '@aws-amplify/ui-react';
import { SeriesPoint } from 'd3';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { useProfile } from '../context/ProfileContext';

interface FlexibleDataItem {
  [key: string]: number | string;
}

interface HousingProps {
  width: number;
  processedData: FlexibleDataItem[];
}

const keys = [
  'rent',
  'firstMonth',
  'furniture',
  'utilities',
  'keyDeposit',
  'laundry',
  'movers',
];

const colors = [
  '#F2695D',
  '#FBD166',
  '#B8D98D',
  '#2f4eac',
  '#5125E8',
  '#F6D9D7',
  '#af6860',
];

const Housing: React.FC<HousingProps> = ({ processedData, width }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'rai');
  const { activeCity, setActiveCity } = useProfile();

  const sortedData = useMemo(
    () =>
      [...processedData].sort((a, b) => {
        const totalA = keys.reduce(
          (sum, key) => sum + (a[key as keyof typeof a] as number),
          0
        );
        const totalB = keys.reduce(
          (sum, key) => sum + (b[key as keyof typeof b] as number),
          0
        );
        return totalB - totalA;
      }),
    [processedData]
  );

  const handleScroll = () => {
    const element = document.querySelector(
      `[data-section="housingJourneyInView"]`
    );
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const onBarClick = (d: FlexibleDataItem | SeriesPoint<FlexibleDataItem>) => {
    setActiveCity((d as SeriesPoint<FlexibleDataItem>).data.city as string);
    handleScroll();
  };

  const resetCity = () => {
    setActiveCity(null);
  };

  return (
    <View marginTop='xxxl'>
      <Heading level={1} marginBottom='large'>
        <Trans
          t={t}
          i18nKey='rent_title'
          components={{ span: <span className='highlight' /> }}
        />
      </Heading>
      <Text marginBottom='large' textAlign='center'>
        {t('rent_desc')}
      </Text>
      <BarChartStacked
        id='housing'
        loading={!(sortedData.length > 0)}
        filterLabel={activeCity}
        marginLeft={100}
        onBarClick={onBarClick}
        width={width}
        colors={colors}
        data={sortedData}
        keys={keys}
        labelAccessor={(d) => d.city as string}
        tFile='rai'
      >
        <Button onClick={resetCity} size='small' color='font.primary'>
          {t('reset_city')}
        </Button>
      </BarChartStacked>
    </View>
  );
};

export default Housing;
