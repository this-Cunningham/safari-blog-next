import { ReactNode } from 'react';

import { Adventure } from '../interfaces_blog';
import MapAndAdventures from './googleMaps';
import { client } from 'src/lib/sanity.client';

export default async function MapLayout ({ children }: { children: ReactNode }) {
  const adventures: Adventure[] = await client.fetch(`//groq
    *[_type == 'adventure'] | order(publishedAt desc) {
      _id,
      adventureName,
      publishedAt,
      adventureBlogPosts[]->{
        publishedAt,
        location->{
          locationName,
          mapLocation,
          slug
        }
      } | order(publishedAt desc),
      adventureSlug,
    }
  `);

  return (
    <div className='w-full'>
      <div className='flex justify-between items-end font-serif font-normal mb-4 sm:mb-10'>
        <h1 className='text-4xl sm:text-7xl'> Adventures </h1>
        <h2 className='text-lg sm:text-3xl h-full sm:pb-1'>
          Current Location: <span className='text-skyPrimary-600 font-bold'>{adventures[0].adventureBlogPosts[0].location.locationName}</span>
        </h2>
      </div>
      <MapAndAdventures adventures={ adventures } />
      { children }
    </div>
  );
};