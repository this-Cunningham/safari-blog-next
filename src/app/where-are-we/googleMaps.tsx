'use client';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

import { PublishedLocation } from '../interfaces_blog';
import styles from './googleMaps.module.css';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const useGoogleMaps = (options: { apiKey: string; locationList: PublishedLocation[] }) => {
  const { apiKey, locationList } = options;
  const router = useRouter();
  const pathName = usePathname();

  const mapsRef = useRef<HTMLDivElement>(null);
  const mapControllerRef = useRef<google.maps.Map | null>(null);

  const indexOfLocationSlugFromRoutePath = locationList.findIndex(location => {
    return pathName?.includes(location.slug.current);
  });

  const mapCenterIndex = indexOfLocationSlugFromRoutePath !== -1
    ? indexOfLocationSlugFromRoutePath
    : locationList.length - 1;

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey
    });

    const initGoogleMaps = async () => {
      if (!mapsRef.current) {
        return;
      }
      const google = await loader.load();

      mapControllerRef.current = new google.maps.Map(mapsRef.current, {
        zoom: 6,
        center: {
          lat: locationList[mapCenterIndex].mapLocation.lat,
          lng: locationList[mapCenterIndex].mapLocation.lng
        },
        streetViewControl: false,
      });

      const path = locationList.map((location, index) => {
        const {
          locationName,
          mapLocation: { lat, lng },
        } = location;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapControllerRef.current,
          label: {
            className: '',
            fontFamily: '',
            fontSize: '20px',
            fontWeight: '500',
            color: '#1c2331',
            text: index == locationList.length - 1 ? '⛵️' : `${index + 1}`,
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: index == locationList.length - 1 ? 20 : 16,
            fillColor: '#e9d67a',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#1c2331',
          }
        });
        const infoWindowHtml = `
          <strong>${locationName}:</strong>
          <div>Click marker to show content from <strong>${locationName}</strong></div>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: infoWindowHtml,
        });

        google.maps.event.addListener(marker, 'mouseover', function() {
          infoWindow.open(mapControllerRef.current, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });

        marker.addListener( 'click', () => {
          router.push(`/where-are-we/${location.slug.current}`);
        });

        return { lat, lng };
      });

      const arrow = {
        path: 'M 0,-5 L 10,0 L 0,5',
        strokeColor: '#1c2331',
        fillColor: '#1c2331',
        fillOpacity: 1,
        rotation: 270,
        scale: 1
      };

      const line = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#1c2331',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [{
          icon: arrow,
          repeat: '240px',
        }]
      });

      line.setMap(mapControllerRef.current);
    };

    initGoogleMaps();
    console.log('google map useeffect ran', window.location.pathname);
    // not including pathname here because dont want map to re-render everytime path changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // this useEffect reacts to the mapCenterIndex...which reacts to our route...this will pan the map when the route changes
    if (!mapControllerRef.current) {
      return;
    }
    console.log('panning useEffect ran');
    mapControllerRef.current.panTo({
      lat: locationList[mapCenterIndex].mapLocation.lat,
      lng: locationList[mapCenterIndex].mapLocation.lng
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCenterIndex]);

  return { mapsRef };
};

const GoogleMaps = function ({ locations, children }: { locations: PublishedLocation[]; children: React.ReactNode }) {
  const { mapsRef } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    locationList: locations,
  });

  return (
    <>
      <div id={ styles.googleMapsContainer } ref={ mapsRef } />
      { children }
    </>
  );
};

export default React.memo(GoogleMaps);