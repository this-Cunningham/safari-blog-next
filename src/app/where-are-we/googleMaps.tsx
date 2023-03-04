'use client';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

import { PublishedLocation } from '../interfaces_blog';
import styles from './googleMaps.module.css';
import React from 'react';

const useGoogleMaps = (options: { apiKey: string; locationList: PublishedLocation[] }) => {
  const { apiKey, locationList } = options;

  const [selectedLocation, setSelectedLocation] = React.useState<string | null>(locationList[locationList.length - 1].locationName);
  const mapsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: window.location.href.includes('localhost') ? '' : apiKey
    });

    const initGoogleMaps = async () => {
      if (!mapsRef.current) {
        return;
      }
      const google = await loader.load();

      const map = new google.maps.Map(mapsRef.current, {
        zoom: 8,
        center: {
          lat: locationList[locationList.length - 1].mapLocation.lat,
          lng: locationList[locationList.length - 1].mapLocation.lng
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
          map,
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
          infoWindow.open(map, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });

        marker.addListener( 'click', () => {
          setSelectedLocation(locationName);
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

      line.setMap(map);
    };

    initGoogleMaps();

  }, [apiKey, locationList]);

  return { mapsRef, selectedLocation };
};

export default function GoogleMaps ({ locations, children }: { locations: PublishedLocation[]; children: React.ReactNode }) {
  const { mapsRef, selectedLocation } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    locationList: locations,
  });

  return (
    <>
      <div id={ styles.googleMapsContainer } ref={ mapsRef } />
      { !selectedLocation && (
        <h3>Click on a map marker to show content</h3>
      )}
      {/* my hope is this allows us to utilize pre-rendered components
      and filter them based on the location state in this client component */}
      { React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.props['data-location'] == selectedLocation) {
            return child;
          } else return null;
        }
        return null;
      }) }
    </>
  );
}