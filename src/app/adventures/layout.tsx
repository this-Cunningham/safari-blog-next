import { ReactNode } from 'react';

import { Adventure } from 'src/app/interfaces_blog';
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
      } | order(publishedAt asc),
      adventureSlug,
    }
  `);

  const mostRecentBlogPost = adventures[0].adventureBlogPosts.slice(-1)[0];

  return (
    <div className='p-4 sm:p-12'>
      <div className='flex justify-between items-end font-serif font-normal mb-4 md:mb-10'>
        <h1 className='text-3xl md:text-7xl'> Adventures </h1>
        <h2 className='text-lg md:text-3xl text-right h-full sm:pb-1'>
          Current Location: <span className='text-skyPrimary-600 font-bold'>{mostRecentBlogPost.location.locationName}</span>
        </h2>
      </div>
      <MapAndAdventures adventures={ adventures } />
      { children }
    </div>
  );
};