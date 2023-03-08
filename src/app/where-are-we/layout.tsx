import React from 'react';

import { PublishedLocation } from '../interfaces_blog';
import GoogleMaps from './googleMaps';
import { client } from 'src/lib/sanity.client';

export default async function MapLayout ({ children }: { children: React.ReactNode }) {
  const publishedLocations: PublishedLocation[] = await client.fetch(`//groq
    *[_type == "location"]{
      locationName,
      mapLocation,
      slug{ current },
      "locationBlogPosts": *[_type=='blogPost' && references(^._id)] | order(publishedAt desc){
        _id,
        title,
        excerpt,
        mainImage->{_createdAt, caption, image{ ..., asset-> }, author->{ name, slug } },
        slug,
        publishedAt,
        tags[]->{"slug": slug.current, tagName},
      },
      "locationImages": *[_type=='blogImage' && references(^._id)]{
        _id,
        image{
          ...,
          asset->
        }
      }
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
    <div style={{ width: '100%' }}>
      <h1>Location</h1>
      <GoogleMaps locations={ locationsWithBlogPostsSorted } />
      { children }
    </div>
  );
};