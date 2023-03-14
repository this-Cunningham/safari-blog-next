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
  // const locationsWithBlogPostsSorted = publishedLocations.filter(location => {
  //   return location.locationBlogPosts.length !== 0;
  // }).sort((a, b) => {
  //   const aTime = new Date(a.locationBlogPosts[0].publishedAt).getTime();
  //   const bTime = new Date(b.locationBlogPosts[0].publishedAt).getTime();

  //   return aTime - bTime;
  // });

  return (
    <div className='w-full'>
      <MapAndAdventures adventures={ adventures } />
      { children }
    </div>
  );
};