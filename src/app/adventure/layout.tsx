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
  console.log('adventure layout ran');
  return (
    <div className='w-full'>
      <MapAndAdventures adventures={ adventures } />
      { children }
    </div>
  );
};