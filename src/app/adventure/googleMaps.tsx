'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Loader } from '@googlemaps/js-api-loader';

import { Adventure, PublishedLocation } from '../interfaces_blog';
import { usePathname, useRouter } from 'next/navigation';

const useGoogleMaps = (options: { apiKey: string; locationList: PublishedLocation[] }) => {
  const { apiKey, locationList } = options;

  // this attaches to div which contains the google map
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // this is the specific instance of our google map, it is NOT the entire library of functions for google maps
  const googleMapInstanceRef = useRef<google.maps.Map>();

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

      googleMapInstanceRef.current = new google.maps.Map(mapContainerRef.current, {
        zoom: 7,
        center: {
          lat: locationList[locationList.length - 1].mapLocation.lat,
          lng: locationList[locationList.length - 1].mapLocation.lng
        },
        streetViewControl: false,
      });
    };

    if (googleMapInstanceRef.current) {
      // googleMapInstanceRef.current points at our google map instance
      // do not want to re-initialize a google map instance w/ "initGoogleMaps()" if we already have one
      // this was causing re-rendering when using router.push()
      return;
    }

    initGoogleMaps();

  }, [apiKey, locationList]);

  return { mapContainerRef, googleMapInstanceRef, line, markerList };
};

export default function MapAndAdventures ({ adventures }: { adventures: Adventure[] }) {
  const { mapContainerRef, googleMapInstanceRef, line, markerList } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    locationList: adventures[0].adventureBlogPosts.map(blogpost => blogpost.location),
  });

  const adventureMapMemo = React.useMemo(() => {
    return adventures.reduce((accum, curr) => {
      return ({
        ...accum,
        [curr.adventureSlug.current]: curr.adventureBlogPosts.map(blogPost => ({
          ...blogPost.location.mapLocation,
          locationSlug: blogPost.location.slug.current
        })),
      });
    }, {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({adventureMap: adventureMapMemo});

  const pathName = usePathname();
  const router = useRouter();

  if (!pathName) {
    return null;
  }
  // THE GOAL HERE IS TO HAVE THE MAP BE REACTIVE TO THE ROUTES
  // WE WANT TO TREAT THE ROUTE AS THE STATE OF THE MAP
  // IF THE ROUTE CHANGES THERE SHOULD BE useEffects RUNNING TO PAN TO THE LOCATION
  // AS WELL AS UPDATE THE LINES TO MATCH THE ADVENTURE FROM THE ROUTE
  // const [adventureName, locationName] = pathName.split('/').slice(2);


  // const indexOfLocationSlugFromRoutePath = locationList.findIndex(location => {
  //   return pathName?.includes(location.slug.current);
  // });

  // const mapCenterIndex = indexOfLocationSlugFromRoutePath !== -1
  //   ? indexOfLocationSlugFromRoutePath
  //   : locationList.length - 1;

  //   useEffect(() => {
  //     // this useEffect reacts to the mapCenterIndex
  //     // mapCenterIndex reacts to our route...
  //     // this will pan the map when the route changes
  //     if (!googleMapInstanceRef.current) {
  //       return;
  //     }

  //     googleMapInstanceRef.current.panTo({
  //       lat: locationList[mapCenterIndex].mapLocation.lat,
  //       lng: locationList[mapCenterIndex].mapLocation.lng
  //     });

  //   }, [locationList, mapCenterIndex]);

  const replaceMarkersAndPolyline = (adventure: Adventure) => {
    if (!googleMapInstanceRef.current) {
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

    const locationList = adventure.adventureBlogPosts.map(blogpost => blogpost.location);

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

      markerList.current.push(marker);

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
        router.push(`/adventure/${adventure.adventureSlug.current}/${location.slug.current}`);
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

  return (
    <div className='flex mb-8 gap-6'>
      <div className='h-72 sm:h-[60vh] rounded-lg flex-1' ref={ mapContainerRef } />
      <ul className='w-40 flex flex-col gap-2 items-center bg-gray-400 rounded p-2'>
        { adventures.map(adventure => (
          <Link
            onClick={ () => replaceMarkersAndPolyline(adventure)}
            href={ `/adventure/${adventure.adventureSlug.current}` }
            key={ adventure._id }
          >
            { adventure.adventureName }
          </Link>
        ))}
      </ul>
    </div>
  );
};