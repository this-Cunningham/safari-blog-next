import { client } from 'src/lib/sanity.client';
import GoogleMaps from './googleMaps';

import { Location as BlogLocation } from '../interfaces_blog';

export default async function WhereAreWe () {
  const locations: BlogLocation[] = await client.fetch(`*[_type == "location"]{
    _type,
    _createdAt,
    locationName,
    mapLocation,
    "locationBlogPosts": *[_type=='blogPost' && references(^._id)]{
      _id,
      title,
      mainImage->,
      author,
      body,
      slug,
      publishedAt,
      categories,
  },
    "locationImages": *[_type=='blogImage' && references(^._id)]{
      _id,
      image{
        asset->
      }
    }
  }`);

  // this query needs to either populate location photos/blogPosts below the interactive google map or needs to direct to a route like blog/at/[location-slug] or "photos/at/[location-slug]" or create a new route for locations... "locations/[location-slug]"

  return (
    <div style={{ width: '100%' }}>
      <h1>Location</h1>
      <GoogleMaps locations={ locations }/>
    </div>
  );
}