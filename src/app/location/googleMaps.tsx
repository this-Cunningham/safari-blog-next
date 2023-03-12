'use client';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

import { PublishedLocation } from '../interfaces_blog';
import styles from './googleMaps.module.css';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const useGoogleMaps = (options: { apiKey: string; locationList: PublishedLocation[] }) => {
  const { apiKey, locationList } = options;

  const pathName = usePathname();
  const router = useRouter();

  const mapsRef = useRef<HTMLDivElement>(null);
  const mapControllerRef = useRef<google.maps.Map>();

  const indexOfLocationSlugFromRoutePath = locationList.findIndex(location => {
    return pathName?.includes(location.slug.current);
  });

  const mapCenterIndex = indexOfLocationSlugFromRoutePath !== -1
    ? indexOfLocationSlugFromRoutePath
    : locationList.length - 1;

  useEffect(() => {
    const loader = new Loader({
      apiKey: window.location.href.includes('localhost') ? '' : apiKey
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
          router.push(`/location/${location.slug.current}`);
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

    if (mapControllerRef.current) {
      // mapControllerRef.current points at our google map instance
      // do not want to re-initialize a google map instance w/ "initGoogleMaps()" if we already have one
      // this was causing re-rendering when using router.push()
      return;
    }

    initGoogleMaps();

  }, [apiKey, locationList, mapCenterIndex, router]);

  useEffect(() => {
    // this useEffect reacts to the mapCenterIndex
    // mapCenterIndex reacts to our route...
    // this will pan the map when the route changes
    if (!mapControllerRef.current) {
      return;
    }

    mapControllerRef.current.panTo({
      lat: locationList[mapCenterIndex].mapLocation.lat,
      lng: locationList[mapCenterIndex].mapLocation.lng
    });

  }, [locationList, mapCenterIndex]);

  return { mapsRef };
};

export default function GoogleMaps ({ locations }: { locations: PublishedLocation[] }) {
  const { mapsRef } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    locationList: locations,
  });

  return (
    <div id={ styles.googleMapsContainer } ref={ mapsRef } />
  );
};