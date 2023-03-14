import { ReactNode } from 'react';

import { PublishedLocation } from '../interfaces_blog';
import MapAndAdventures from './googleMaps';
import { client } from 'src/lib/sanity.client';

export default async function MapLayout ({ children }: { children: ReactNode }) {
  const publishedLocations: PublishedLocation[] = await client.fetch(`//groq
    *[_type == "location"]{
      locationName,
      mapLocation,
      slug{ current },
      "locationBlogPosts": *[_type=='blogPost' && references(^._id)] | order(publishedAt desc){
        publishedAt,
      },
    }
  `);

  const locationsWithBlogPostsSorted = publishedLocations.filter(location => {
    return location.locationBlogPosts.length !== 0;
  }).sort((a, b) => {
    const aTime = new Date(a.locationBlogPosts[0].publishedAt).getTime();
    const bTime = new Date(b.locationBlogPosts[0].publishedAt).getTime();

    return aTime - bTime;
  });

  return (
    <div className='w-full'>
      <MapAndAdventures locations={ locationsWithBlogPostsSorted } />
      { children }
    </div>
  );
};