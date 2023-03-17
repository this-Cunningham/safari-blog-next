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
      <h1 className='font-serif font-normal text-4xl sm:text-7xl'>
        Adventures
      </h1>
      <h2 className='font-serif font-normal text-lg sm:text-3xl sm:my-5'>
        Current Location: <span className='text-skyPrimary-600 font-bold'>{adventures[0].adventureBlogPosts[0].location.locationName}</span>
      </h2>
      <MapAndAdventures adventures={ adventures } />
      { children }
    </div>
  );
};