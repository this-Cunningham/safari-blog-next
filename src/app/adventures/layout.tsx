import { ReactNode } from 'react';

import { Adventure } from 'src/app/interfaces_blog';
import MapAndAdventures from './AdventuresMap';
import { client } from 'src/lib/sanity.client';
import { SiteSectionHeader } from 'src/components/atoms/TextAtoms';

export default async function MapLayout ({ children }: { children: ReactNode }) {
  const adventures: Adventure[] = await client.fetch(`//groq
    *[_type == 'adventure'] | order(publishedAt desc) {
      _id,
      adventureName,
      publishedAt,
      adventureBlogPosts[]->{
        publishedAt,
        location->{
          _id,
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

      <div className='flex flex-col sm:flex-row justify-between sm:items-end font-serif'>
        <SiteSectionHeader>Adventures</SiteSectionHeader>
        <h2 className='text-sm md:text-2xl text-center sm:text-right h-full sm:pb-1 mb-2 sm:mb-8 md:mb-10'>
          Currently in: {' '}
          <span className='text-skyPrimary-600 font-bold'>
            {mostRecentBlogPost.location.locationName}
          </span>
        </h2>
      </div>

      <MapAndAdventures adventures={ adventures } />

      { children }
    </div>
  );
};