import { Button, Flex, Heading, Text } from '@aws-amplify/ui-react';
import { Feature, GeoJsonProperties, Geometry, Point } from 'geojson';
import _ from 'lodash';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState } from 'react';
import Map, {
  MapEvent,
  MapMouseEvent,
  MapRef,
  NavigationControl,
  ViewState,
} from 'react-map-gl';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import Drawer from '../Drawer';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const height = 600;

interface CustomMapProps {
  width: number;
}

interface CityViewProps {
  item: {
    City: string;
    Rank: number;
    Strength_1: string;
    Strength_2: string;
    'Room for Improvement': string;
  };
}

const ResetButton = styled(Button)`
  z-index: 2;
  top: 10px;
  left: var(--amplify-space-xxl);
  position: absolute;
`;

const CityViewContainer = styled(Flex)`
  width: 100%;
  min-height: calc(${height}px - var(--amplify-space-x));
  flex-direction: column;
  flex-grow: 1;
`;

const initialView: ViewState = {
  longitude: -86.08,
  latitude: 54.67,
  pitch: 0,
  bearing: 0,
  zoom: 3,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const CityView: React.FC<CityViewProps> = ({ item }) => {
  return (
    <CityViewContainer>
      <Heading level={4} color='font.inverse'>
        {item.City} | Rank #{item.Rank}
      </Heading>
      <Text>{item.Strength_1}</Text>
      <Text>{item.Strength_2}</Text>
      <Text>{item['Room for Improvement']}</Text>
    </CityViewContainer>
  );
};

const CustomMap: React.FC<CustomMapProps> = ({ width }) => {
  const [viewState, setViewState] = useState<ViewState>(initialView);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<
    Feature<Point, GeoJsonProperties>[]
  >([]);
  const [allFeatures, setAllFeatures] = useState<GeoJsonProperties[]>([]);
  const mapRef = useRef<MapRef>(null);

  const isPoint = (geometry: Geometry): geometry is Point =>
    geometry.type === 'Point';

  const onClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0] as Feature<Point, GeoJsonProperties>;

    if (feature && mapRef.current && isPoint(feature.geometry)) {
      const coordinates = feature.geometry.coordinates as [number, number];
      mapRef.current.flyTo({
        center: coordinates,
        zoom: 16,
        pitch: 54,
        bearing: 0,
        duration: 2000,
      });
      setDrawerOpen(true);
      setCurrentFeature([feature]);
      setCompleted(true);
    }
  };

  const onReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    mapRef.current?.flyTo({
      center: [initialView.longitude, initialView.latitude],
      zoom: initialView.zoom,
      pitch: initialView.pitch,
      bearing: initialView.bearing,
      duration: 2000,
    });
    setDrawerOpen(false);
    setCurrentFeature([]);
    setCompleted(true);
  };

  const onLoad = (event: MapEvent) => {
    const map = event.target as mapboxgl.Map;
    // Get the features from the interactive layer
    const features = map.queryRenderedFeatures(undefined, {
      layers: ['uwi-2023-overall-2'], // Specify the interactive layer ID
    });

    if (features.length > 0) {
      const propertiesArray = features.map((item) => item.properties);
      const sortedArray = _.sortBy(propertiesArray, ['Rank']);
      setAllFeatures(sortedArray as Feature<Point, GeoJsonProperties>[]);
    }
  };

  return (
    <Map
      latitude={viewState.latitude}
      longitude={viewState.longitude}
      zoom={viewState.zoom}
      ref={mapRef}
      initialViewState={initialView}
      scrollZoom
      onLoad={(e) => onLoad(e)}
      onMove={(e) => setViewState(e.viewState)}
      style={{ width, height }}
      mapStyle='mapbox://styles/youthfulcities/clzrhcvrj00hf01pc44in6vrn'
      interactiveLayerIds={['uwi-2023-overall-2']}
      onClick={onClick}
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <ResetButton variation='primary' onClick={(e) => onReset(e)}>
        Reset
      </ResetButton>
      <NavigationControl position='top-left' />
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        noOverlay
        noClickOutside
        absolute
      >
        <Flex direction='column'>
          {currentFeature.length > 0 ? (
            currentFeature.map((item) => (
              <CityView key={uuid()} item={item.properties as any} />
            ))
          ) : (
            <Text>Click on a city to get started!</Text>
          )}
        </Flex>
      </Drawer>
    </Map>
  );
};

export default CustomMap;
