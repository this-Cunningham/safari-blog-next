'use client';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

import { Location } from '../interfaces_blog';
import styles from './googleMaps.module.css';

const useGoogleMaps = (options: { apiKey: string; locationList: Location[] }) => {
  const { apiKey, locationList } = options;

  const mapsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({ apiKey });

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
        const { locationName, mapLocation: { lat, lng } } = location;

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
            scale: 16,
            fillColor: '#e9d67a',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#1c2331',
          }
        });

        const infoWindowHtml = `
          <div><strong>${locationName}:</strong></div>
          <div><strong>Related Blog Posts:</strong> Link to Blog Posts</div>
          <div><strong>Photos:</strong> Link To photos</div>
        `;

        google.maps.event.addListener(marker, 'mouseover', function() {
          const infoWindow = new google.maps.InfoWindow({
            // content: `Date: ${location.date.toDateString()}`
            content: infoWindowHtml,
          });
          infoWindow.open(map, marker);
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

  return { mapsRef };
};

export default function GoogleMaps ({ locations }: { locations: Location[] }) {
  const { mapsRef } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    locationList: locations,
  });

  return (
    <div id={ styles.googleMapsContainer } ref={ mapsRef } />
  );
}