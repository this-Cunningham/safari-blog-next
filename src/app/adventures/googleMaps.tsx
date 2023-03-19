'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Loader } from '@googlemaps/js-api-loader';

import { Adventure, PublishedLocation } from '../interfaces_blog';
import { usePathname, useRouter } from 'next/navigation';

const useGoogleMaps = (options: { apiKey: string; locationList: PublishedLocation[] }) => {
  const { apiKey, locationList } = options;
  const [googleMapInstance, setGoogleMapInstance] = React.useState<google.maps.Map>();
  // this attaches to div which contains the google map
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // this is the specific instance of our google map, it is NOT the entire library of functions for google maps

  const line = useRef<google.maps.Polyline | null>(null);
  const markerList = useRef<google.maps.Marker[]>([]);

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
      setGoogleMapInstance(new google.maps.Map(mapContainerRef.current, {
        zoom: 6,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        },
        center: {
          lat: locationList[locationList.length - 1].mapLocation.lat,
          lng: locationList[locationList.length - 1].mapLocation.lng
        },
        streetViewControl: false,
      }));
    };

    if (googleMapInstance) {
      // googleMapInstance points at our google map instance
      // do not want to re-initialize a google map instance w/ "initGoogleMaps()" if we already have one
      // this was causing re-rendering when using router.push()
      return;
    }

    initGoogleMaps();

  }, [apiKey, googleMapInstance, locationList]);

  return { mapContainerRef, googleMapInstance, line, markerList };
};

export default function MapAndAdventures ({ adventures }: { adventures: Adventure[] }) {
  const { mapContainerRef, googleMapInstance, line, markerList } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    locationList: adventures[0].adventureBlogPosts.map(blogpost => blogpost.location),
  });

  const adventureMapMemo:
    Record<string, { lat: number , lng: number, locationSlug: string, locationName: string }[]>
  = React.useMemo(() => {
    return adventures.reduce((accum, curr) => ({
      ...accum,
      [curr.adventureSlug.current]: curr.adventureBlogPosts.map(blogPost => ({
        ...blogPost.location.mapLocation,
        locationName: blogPost.location.locationName,
        locationSlug: blogPost.location.slug.current,
      })),
    }), {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pathName = usePathname();
  const router = useRouter();

  let [currentAdventureSlug, currentLocationSlug] = pathName?.split('/').slice(2) ?? [];
  // if cannot find a "currentAdventureName" from the route then defaults to adventures[0] (most recent adventure)
  if (!currentAdventureSlug && !currentLocationSlug) {
    // if both are undefined, it means we are on /adventure... so show the current location of current adventure
    currentAdventureSlug = currentAdventureSlug ?? adventures[0].adventureSlug.current;
    currentLocationSlug = adventureMapMemo[currentAdventureSlug][adventureMapMemo[currentAdventureSlug].length - 1].locationSlug;
  } else {
    // if one is defined it means someone has clicked on an adventure, show from beginning if location undefined
    currentAdventureSlug = currentAdventureSlug ?? adventures[0].adventureSlug.current;
    currentLocationSlug = currentLocationSlug ?? adventureMapMemo[currentAdventureSlug][0].locationSlug;
  }

  const currentAdventureData = adventureMapMemo[currentAdventureSlug];

  useEffect(() => {
    const replaceMarkersAndPolyline = () => {
      if (!googleMapInstance) {
        return;
      }

      // remove current polyline from map instance
      line.current?.setMap(null);

      // remove current map markers from map instance
      markerList.current.length && markerList.current.forEach(marker => {
        marker.setMap(null);
      });

      // reset marker list and get it ready for new markers
      markerList.current = [];

      const path = currentAdventureData.map((blogPost, index) => {
        const { locationName, locationSlug, lat, lng } = blogPost;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: googleMapInstance,
          label: {
            className: '',
            fontFamily: '',
            fontSize: '16px',
            fontWeight: '500',
            color: '#1c2331',
            text: index == currentAdventureData.length - 1 ? '⛵️' : `${index + 1}`,
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: index == currentAdventureData.length - 1 ? 16 : 12,
            fillColor: '#e9d67a',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#1c2331',
          }
        });

        markerList.current.push(marker);

        const infoWindowHtml = `
          <strong>${locationName}:</strong>
          <div>Click marker to show content from <strong>${locationName}</strong></div>
        `;

        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowHtml,
        });

        google.maps.event.addListener(marker, 'mouseover', function() {
          infoWindow.open(googleMapInstance, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });

        marker.addListener( 'click', () => {
          router.push(`/adventures/${currentAdventureSlug}/${locationSlug}`);
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
      line.current.setMap(googleMapInstance);
    };

    replaceMarkersAndPolyline();

  }, [currentAdventureData, currentAdventureSlug, googleMapInstance, line, markerList, router]);

  useEffect(() => {
    // this useEffect reacts to the mapCenterIndex
    // mapCenterIndex reacts to our route...
    // this will pan the map when the route changes
    if (!googleMapInstance) {
      return;
    }

    const indexOfLocationSlugFromRoutePath = currentAdventureData.findIndex(({ locationSlug }) => {
      return currentLocationSlug == locationSlug;
    });

    const mapCenterIndex = indexOfLocationSlugFromRoutePath !== -1
      ? indexOfLocationSlugFromRoutePath
      : currentAdventureData.length - 1;

    googleMapInstance.panTo({
      lat: currentAdventureData[mapCenterIndex].lat,
      lng: currentAdventureData[mapCenterIndex].lng
    });

  }, [currentAdventureData, currentLocationSlug, googleMapInstance]);

  return (
    <div className='flex mb-8 gap-5 lg:gap-12 flex-col sm:flex-row'>
      <div className='h-72 w-full rounded-lg sm:h-[400px] sm:flex-1' ref={ mapContainerRef } />

      <ul className='w-full sm:w-64 lg:w-96 flex flex-col gap-3 items-center bg-skyPrimary-100 rounded drop-shadow-md p-5'>
        <h3 className='font-serif font-bold text-2xl mb-2'>Adventures</h3>
        { adventures.map((adventure, index) => (
          <li key={ adventure._id }>
            <Link
              className='font-sans text-base font-normal text-black hover:underline'
              href={ `/adventures/${adventure.adventureSlug.current}` }
            >
              { adventure.adventureName } { index == 0 && ' (current)'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};