import { Button, Flex, Heading, Text } from '@aws-amplify/ui-react';
import { Feature, GeoJsonProperties, Point } from 'geojson';
import _ from 'lodash';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Map, {
  MapEvent,
  MapMouseEvent,
  MapRef,
  NavigationControl,
  PointLike,
  ViewState,
} from 'react-map-gl';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
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

const DrawerContent = styled(Flex)`
  max-height: 100%;
  flex-direction: column;
`;

const ResetButton = styled(Button)`
  z-index: 2;
  top: 10px;
  left: var(--amplify-space-xxl);
  position: absolute;
`;

const CityViewContainer = styled(Flex)`
  width: 100%;
  min-height: calc(${height}px);
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

const CityView = forwardRef<HTMLDivElement, CityViewProps>(({ item }, ref) => {
  return (
    <CityViewContainer
      ref={ref}
      id={item.City} // Ensure this matches the feature ID
    >
      <Heading level={4} color='font.inverse'>
        {item.City} | Rank #{item.Rank}
      </Heading>
      <Text>{item.Strength_1}</Text>
      <Text>{item.Strength_2}</Text>
      <Text>{item['Room for Improvement']}</Text>
    </CityViewContainer>
  );
});

CityView.displayName = 'CityView';

const CustomMap: React.FC<CustomMapProps> = ({ width }) => {
  const [viewState, setViewState] = useState<ViewState>(initialView);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<Feature<
    Point,
    GeoJsonProperties
  > | null>(null);
  const [allFeatures, setAllFeatures] = useState<
    Feature<Point, GeoJsonProperties>[]
  >([]);
  const mapRef = useRef<MapRef>(null);
  const cityViewRefs = useRef<HTMLDivElement[]>([]);
  const [override, setOverride] = useState(false);

  useEffect(() => {
    // Clear old refs before setting new ones
    cityViewRefs.current = [];
  }, []);

  const onClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0] as Feature<Point, GeoJsonProperties>;
    if (feature) {
      setCurrentFeature((prevFeature) => {
        if (prevFeature?.properties?.City !== feature.properties?.City) {
          return feature;
        }
        return prevFeature;
      });
      setDrawerOpen(true);

      // Use react-scroll to scroll the corresponding CityView item into view within the Drawer
      const currentCityName = feature.properties?.City;
      if (currentCityName) {
        scroller.scrollTo(currentCityName, {
          duration: 800,
          delay: 0,
          offset: -20,
          smooth: 'easeInOutQuart',
          containerId: 'drawer-content', // This is the ID of the container in Drawer
        });
      }
    }
    setOverride(true);
  };

  const onReset = () => {
    mapRef.current?.flyTo({
      center: [initialView.longitude, initialView.latitude],
      zoom: initialView.zoom,
      pitch: initialView.pitch,
      bearing: initialView.bearing,
      duration: 2000,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    setDrawerOpen(false);
    setCompleted(true);
  };

  const onLoad = (event: MapEvent) => {
    const map = event.target as mapboxgl.Map;
    // Get the features from the interactive layer
    const features = map.queryRenderedFeatures(undefined as unknown as PointLike, {
      layers: ['uwi-2023-overall-2'], // Specify the interactive layer ID
    });

    if (features.length > 0) {
      const propertiesArray = features.map((item) => item);
      const sortedArray = _.sortBy(
        propertiesArray,
        (item) => item.properties?.Rank
      );

      setAllFeatures(sortedArray as Feature<Point, GeoJsonProperties>[]);
      setCurrentFeature(sortedArray[0] as Feature<Point, GeoJsonProperties>);
    }
  };

  useEffect(() => {
    if (currentFeature && mapRef.current && drawerOpen) {
      const coordinates = currentFeature.geometry.coordinates as [
        number,
        number,
      ];
      mapRef.current.flyTo({
        center: coordinates,
        zoom: 16,
        pitch: 54,
        bearing: 0,
        duration: 4000,
        padding: { top: 0, bottom: 0, left: 0, right: 300 },
      });
    }
  }, [currentFeature, drawerOpen]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    console.log(cityViewRefs.current);
    const observer = new IntersectionObserver((entries) => {
      if (!override) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureId = entry.target.id;
            const feature = allFeatures.find(
              (f) => f.properties?.City === featureId
            );
            if (feature) {
              setCurrentFeature(feature);
            }
          }
        });
      }
    }, options);

    cityViewRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    // Clean up
    return () => {
      cityViewRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [allFeatures, override]);

  useEffect(() => {
    // Only run this effect when `override` is true
    if (override) {
      const timer = setTimeout(() => {
        setOverride(false); // State update happens here
      }, 4000);

      // Cleanup function to clear the timer
      return () => clearTimeout(timer);
    }
    // Return null if there's no timer to clear
    return () => { };
  }, [override]);

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
      <ResetButton variation='primary' onClick={() => onReset()}>
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
        id='drawer-content'
      >
        <>
          {allFeatures.length > 0 &&
            allFeatures.map((item) => (
              <CityView
                key={item.properties?.City}
                item={item.properties as CityViewProps['item']}
                ref={(el) => {
                  if (el) {
                    cityViewRefs.current.push(el);
                  }
                }}
              />
            ))}
        </>
      </Drawer>
    </Map>
  );
};

export default CustomMap;