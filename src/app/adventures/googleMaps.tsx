'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Loader } from '@googlemaps/js-api-loader';
import { Adventure, PublishedLocation } from 'src/app/interfaces_blog';
import { usePathname, useRouter } from 'next/navigation';

const useGoogleMaps = (options: {
  apiKey: string;
  locationList: PublishedLocation[];
  mapContainerRef: React.RefObject<HTMLDivElement>;
}) => {
  const { apiKey, locationList, mapContainerRef } = options;
  const [googleMapInstance, setGoogleMapInstance] = React.useState<google.maps.Map>();

  useEffect(() => {
    const initGoogleMaps = async () => {
      if (!mapContainerRef.current) {
        return;
      }

      const loader = new Loader({
        apiKey: window.location.href.includes('localhost') ? '' : apiKey,
        version: 'beta', // this unlocks marker library
        libraries: ['marker'],
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
        mapId: 'ADVENTURES_MAP_ID' // need any id to use advanced map markers
      }));
    };

    if (googleMapInstance) {
      // googleMapInstance points at our google map instance
      // do not want to re-initialize a google map instance w/ "initGoogleMaps()" if we already have one
      // this was causing re-rendering when using router.push()
      return;
    }

    initGoogleMaps();

  }, [apiKey, googleMapInstance, locationList, mapContainerRef]);

  return { googleMapInstance };
};

const useAdventureAndLocationSlugs = (adventureMap: Record<string, CurrentAdventureLocation[]>, initialAdventureSlug: string) => {
  const pathName = usePathname();

  let [currentAdventureSlug, currentLocationSlug] = pathName?.split('/').slice(2) ?? [];
  // if cannot find a "currentAdventureName" from the route then defaults to adventures[0] (most recent adventure)
  if (!currentAdventureSlug && !currentLocationSlug) {
    // if both are undefined, it means we are on /adventure... so show the current location of current adventure
    currentAdventureSlug = currentAdventureSlug ?? initialAdventureSlug;
    currentLocationSlug = adventureMap[currentAdventureSlug][adventureMap[currentAdventureSlug].length - 1].locationSlug;
  } else {
    // if one is defined it means someone has clicked on an adventure, show from beginning if location undefined
    currentAdventureSlug = currentAdventureSlug ?? initialAdventureSlug;
    currentLocationSlug = currentLocationSlug ?? adventureMap[currentAdventureSlug][0].locationSlug;
  }
  return [currentAdventureSlug, currentLocationSlug];
};

const LocationMarker = (
  { locationName, selected }:
  { locationName: string; selected: boolean }
) => {
  return (
    <div className={ `${selected ? 'bg-skyPrimary-700 text-yellowAccent-100' : 'bg-yellowAccent-100 text-skyPrimary-700'} text-base font-semibold drop-shadow-md py-2 px-2 rounded-lg hover:bg-skyPrimary-700 hover:text-yellowAccent-100`}>
      { locationName }
    </div>
  );
};
const LocationMarkerMemo = React.memo(LocationMarker);

type CurrentAdventureLocation = {
  lat: number;
  lng: number;
  locationSlug: string;
  locationName: string;
  markerDiv: HTMLDivElement | null;
};

export default function MapAndAdventures ({ adventures }: { adventures: Adventure[] }) {
  const adventureMapMemo:
    Record<string, CurrentAdventureLocation[]>
  = React.useMemo(() => {
    return adventures.reduce((accum, curr) => ({
      ...accum,
      [curr.adventureSlug.current]: curr.adventureBlogPosts.map(blogPost => ({
        ...blogPost.location.mapLocation,
        locationName: blogPost.location.locationName,
        locationSlug: blogPost.location.slug.current,
        markerDiv: (() => typeof window !== 'undefined' ? document.createElement('div') : null)()
      })),
    }), {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { googleMapInstance } = useGoogleMaps({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    locationList: adventures[0].adventureBlogPosts.map(blogpost => blogpost.location),
    mapContainerRef
  });

  const [currentAdventureSlug, currentLocationSlug] = useAdventureAndLocationSlugs(
    adventureMapMemo,
    adventures[0].adventureSlug.current
  );

  const currentAdventureData = adventureMapMemo[currentAdventureSlug];

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
              className={ `font-sans text-base font-normal text-black hover:underline ${currentAdventureSlug === adventure.adventureSlug.current ? 'underline' : ''}` }
              href={ `/adventures/${adventure.adventureSlug.current}` }
            >
              { adventure.adventureName } { index == 0 && ' (current)'}
            </Link>
          </li>
        ))}
      </ul>
      {
        googleMapInstance && (
          <AdventureMarkersAndLines
            mapInstance={ googleMapInstance }
            currentAdventureLocationData={currentAdventureData}
            currentAdventureSlug={ currentAdventureSlug}
            currentLocationSlug={ currentLocationSlug }
          />
        )
      }
    </div>
  );
};

const AdventureMarkersAndLines = (
  { mapInstance, currentAdventureLocationData, currentAdventureSlug, currentLocationSlug }:
  { mapInstance: google.maps.Map;
    currentAdventureLocationData: CurrentAdventureLocation[];
    currentAdventureSlug: string;
    currentLocationSlug: string;
  }
) => {
  const router = useRouter();
  const line = useRef<google.maps.Polyline | null>(null);
  const markerList = useRef<google.maps.marker.AdvancedMarkerView[]>([]);

  useEffect(() => {
    const markerListPointer = markerList.current;

    const replaceMarkersAndPolyline = () => {
      if (!mapInstance) {
        return;
      }

      const path = currentAdventureLocationData.map((blogPost, index) => {
        const { locationSlug, lat, lng, markerDiv } = blogPost;

        const marker = new google.maps.marker.AdvancedMarkerView({
          position: { lat, lng },
          map: mapInstance,
          content: markerDiv,
          zIndex: 100 - index,
          collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
        });

        markerList.current.push(marker);

        marker.addListener('click', () => {
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
      line.current.setMap(mapInstance);
    };

    replaceMarkersAndPolyline();

    return () => {
        // remove current polyline from map instance
        line.current?.setMap(null);

        //   remove current map markers from map instance
        markerListPointer.length && markerListPointer.forEach(marker => {
          marker.map = null;
        });

        // reset marker list and get it ready for new markers
        markerList.current = [];
    };

  }, [currentAdventureLocationData, currentAdventureSlug, line, mapInstance, markerList, router]);

  return (
    <>
      { currentAdventureLocationData.map(({ locationName, locationSlug, markerDiv }) => {
        if (!markerDiv) {
          return null;
        }

        return (
          createPortal(
            <LocationMarkerMemo
              locationName={ locationName }
              selected={ currentLocationSlug == locationSlug }
            />,
            markerDiv
          )
        );
      })}
    </>
  );
};