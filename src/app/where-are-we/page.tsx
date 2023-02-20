import { client } from 'src/lib/sanity.client';
import GoogleMaps from './googleMaps';

import { Location as BlogLocation } from '../interfaces_blog';

export default async function WhereAreWe () {
  const locations: BlogLocation[] = await client.fetch(`*[_type == "location"]{
    _type,
    _createdAt,
    locationName,
    mapLocation,
    slug{ current },
  }`);

  return (
    <div style={{ width: '100%' }}>
      <h1>Location</h1>
      <GoogleMaps locations={ locations }/>
    </div>
  );
}