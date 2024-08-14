import { Button, Flex, Heading, Text } from '@aws-amplify/ui-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import styled from 'styled-components';
import Drawer from '../Drawer';

import _ from 'lodash';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const height = 600;

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

const initialView = {
  longitude: -86.08,
  latitude: 54.67,
  pitch: 0,
  bearing: 0,
  zoom: 3,
  duration: 2000,
};

const CityView = ({ item }) => {
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

const CustomMap = ({ width }) => {
  const [viewState, setViewState] = useState(initialView);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);
  const mapRef = useRef();

  const onClick = (event) => {
    const feature = event.features[0];

    if (feature) {
      mapRef.current?.flyTo({
        center: feature.geometry.coordinates,
        zoom: 16,
        pitch: 54,
        bearing: 0,
        duration: 2000,
      });
      console.log(feature);
      setDrawerOpen(true);
      setCurrentFeature([feature.properties]);
      setCompleted(true);
    }
  };

  const onReset = (event) => {
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

  const onLoad = (event) => {
    const map = event.target;

    // Get the features from the interactive layer
    const features = map.queryRenderedFeatures({
      layers: ['uwi-2023-overall-2'], // Specify the interactive layer ID
    });

    if (features.length > 0) {
      const propertiesArray = features.map((item) => item.properties);
      const sortedArray = _.sortBy(propertiesArray, ['Rank']);
      setAllFeatures(sortedArray);
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
            currentFeature.map((item) => <CityView key={item} item={item} />)
          ) : (
            <Text>Click on a city to get started!</Text>
          )}
        </Flex>
      </Drawer>
    </Map>
  );
};

export default CustomMap;
