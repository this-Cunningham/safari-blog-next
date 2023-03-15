'use client';

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

import { PublishedLocation } from '../interfaces_blog';
import { usePathname, useRouter } from 'next/navigation';

const useGoogleMaps = (options: { apiKey: string; locationList: PublishedLocation[] }) => {
  const { apiKey, locationList } = options;

  const pathName = usePathname();
  const router = useRouter();

  // this attaches to div which contains the google map
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // this is the specific instance of our google map, it is NOT the entire library of functions for google maps
  const googleMapInstanceRef = useRef<google.maps.Map>();

  const indexOfLocationSlugFromRoutePath = locationList.findIndex(location => {
    return pathName?.includes(location.slug.current);
  });

  const mapCenterIndex = indexOfLocationSlugFromRoutePath !== -1
    ? indexOfLocationSlugFromRoutePath
    : locationList.length - 1;

  const line = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    const initGoogleMaps = async () => {
      if (!mapContainerRef.current) {
        return;
      }

      const loader = new Loader({
        apiKey: window.location.href.includes('localhost') ? '' : apiKey
      });

      await loader.load();

      // can access "google" here as a namespace (without defining variable) as long as we load it in with loader.load()
      // otherwise will need to define "google" as const google = await loader.load();

      googleMapInstanceRef.current = new google.maps.Map(mapContainerRef.current, {
        zoom: 7,
        center: {
          lat: locationList[mapCenterIndex].mapLocation.lat,
          lng: locationList[mapCenterIndex].mapLocation.lng
        },
        streetViewControl: false,
      });

      const path = locationList.map((location, index) => {
        const { locationName, mapLocation: { lat, lng } } = location;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: googleMapInstanceRef.current,
          label: {
            className: '',
            fontFamily: '',
            fontSize: '16px',
            fontWeight: '500',
            color: '#1c2331',
            text: index == locationList.length - 1 ? '⛵️' : `${index + 1}`,
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: index == locationList.length - 1 ? 16 : 12,
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
          infoWindow.open(googleMapInstanceRef.current, marker);
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

      line.current = new google.maps.Polyline({
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

      line.current.setMap(googleMapInstanceRef.current);
    };

    if (googleMapInstanceRef.current) {
      // googleMapInstanceRef.current points at our google map instance
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
    if (!googleMapInstanceRef.current) {
      return;
    }

    googleMapInstanceRef.current.panTo({
      lat: locationList[mapCenterIndex].mapLocation.lat,
      lng: locationList[mapCenterIndex].mapLocation.lng
    });

  }, [locationList, mapCenterIndex]);

  return { mapContainerRef };
};

export default function MapAndAdventures ({ locations }: { locations: PublishedLocation[] }) {
  const { mapContainerRef } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    locationList: locations,
  });

  return (
    <div className='flex mb-8 gap-6'>
      <div className='h-72 sm:h-[40vh] rounded-lg flex-1' ref={ mapContainerRef } />
      <ul className='w-40 flex flex-col gap-2 items-center bg-gray-400 rounded p-2'>
        <li>adventure 1</li>
        <li>adventure 2</li>
        <li>adventure ...</li>
        <li>adventure ...</li>
        <li>adventure ...</li>
      </ul>
    </div>
  );
};