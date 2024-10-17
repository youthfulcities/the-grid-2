import { Button, Flex, Heading, Text, useTheme } from '@aws-amplify/ui-react';
import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import _ from 'lodash';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParams } from 'next/navigation';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';
import Map, {
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
  mapStyle: string;
  dataset: string;
  geoJSON: FeatureCollection;
}

interface CityViewProps {
  item: {
    City: string;
    Score: number;
    Rank: number;
    Strength_1: string;
    Strength_2: string;
    'Room for Improvement': string;
    Force_1: string;
    Force_2: string;
    'Point à améliorer': string;
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
  const { lng } = useParams<{ lng: string }>();
  const { tokens } = useTheme();
  return (
    <CityViewContainer ref={ref} id={item.City}>
      <Heading level={4} color='brand.primary.60'>
        {item.City} |{' '}
        <span className='highlight'>
          {lng === 'fr' ? 'Rang' : 'Rank'} #{item.Rank}
        </span>
      </Heading>
      <Heading level={5} color='font.inverse'>
        Score: {item.Score} / 821
      </Heading>

      <Text>
        <FaThumbsUp
          fontSize='large'
          color={tokens.colors.green[60].toString()}
        />{' '}
        {lng === 'fr' ? item.Force_1 : item.Strength_1}
      </Text>
      <Text>
        <FaThumbsUp
          fontSize='large'
          color={tokens.colors.green[60].toString()}
        />{' '}
        {lng === 'fr' ? item.Force_2 : item.Strength_2}
      </Text>
      <Text>
        <FaThumbsDown
          color={tokens.colors.red[60].toString()}
          fontSize='large'
        />{' '}
        {lng === 'fr'
          ? item['Point à améliorer']
          : item['Room for Improvement']}
      </Text>
    </CityViewContainer>
  );
});

CityView.displayName = 'CityView';

const CustomMap: React.FC<CustomMapProps> = ({
  width,
  mapStyle,
  dataset,
  geoJSON,
}) => {
  const [viewState, setViewState] = useState<ViewState>(initialView);
  const [drawerOpen, setDrawerOpen] = useState(true);
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
  const previousFeatureRef = useRef<Feature<Point, GeoJsonProperties> | null>(
    null
  );

  useEffect(() => {
    // Clear old refs before setting new ones
    cityViewRefs.current = [];
  }, []);

  // Effect to resize the map when width or height changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [width]);

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

      const currentCityName = feature.properties?.City;
      if (currentCityName) {
        scroller.scrollTo(currentCityName, {
          duration: 800,
          delay: 0,
          offset: -20,
          smooth: 'easeInOutQuart',
          containerId: 'drawer-content',
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
    setCurrentFeature(null);
  };

  const onLoad = () => {
    const { features } = geoJSON;

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
    // check if city has actually changed on rerender to prevent bouncing
    if (
      previousFeatureRef?.current?.properties?.City ===
      currentFeature?.properties?.City
    ) {
      return;
    }
    if (currentFeature && mapRef.current && drawerOpen) {
      const coordinates = currentFeature.geometry.coordinates as [
        number,
        number,
      ];

      mapRef.current.flyTo({
        center: coordinates,
        offset: [-100, 0],
        zoom: 10,
        pitch: 50,
        bearing: 0,
        duration: 2000,
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        easing: (t) => t * (2 - t),
      });

      const handleMoveEnd = () => {
        if (mapRef.current) {
          const features =
            mapRef?.current.queryRenderedFeatures(
              undefined as unknown as PointLike,
              {
                layers: [dataset], // Specify the interactive layer ID
              }
            ) || [];

          // Filter for features that are of type Point
          const matchedFeatures = features.filter(
            (feature) =>
              feature.geometry.type === 'Point' &&
              feature.properties?.City === currentFeature?.properties?.City
          ) as Feature<Point, GeoJsonProperties>[]; // Assert the type after filtering

          const updatedCoordinates = matchedFeatures[0]?.geometry
            ?.coordinates as [number, number];

          // Adjust flyTo based on the updated coordinates
          mapRef.current.flyTo({
            center: updatedCoordinates, // Recenter on the original feature coordinates
            zoom: 15.5,
            offset: [-100, 0],
            pitch: 50,
            bearing: 0,
            duration: 2000,
            padding: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
            easing: (t) => t * t,
          });

          // Cleanup the event listener after it runs
          mapRef.current.off('moveend', handleMoveEnd);
        }
      };

      // Attach the moveend event listener to trigger the second flyTo
      mapRef.current.once('moveend', handleMoveEnd);
    }
    // Update the previous feature ref after the logic runs
    previousFeatureRef.current = currentFeature;
  }, [currentFeature, drawerOpen, dataset]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

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
    return () => {};
  }, [override]);

  return (
    <Map
      latitude={viewState.latitude}
      longitude={viewState.longitude}
      zoom={viewState.zoom}
      ref={mapRef}
      initialViewState={initialView}
      scrollZoom
      onLoad={() => onLoad()}
      onMove={(e) => setViewState(e.viewState)}
      style={{ width, height }}
      mapStyle={mapStyle}
      interactiveLayerIds={[dataset]}
      onClick={onClick}
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <ResetButton variation='primary' onClick={() => onReset()}>
        Reset
      </ResetButton>
      <NavigationControl position='top-left' />
      <Drawer
        isopen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        noOverlay
        noClickOutside
        absolute
        id='drawer-content'
      >
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
      </Drawer>
    </Map>
  );
};

export default CustomMap;
