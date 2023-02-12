import { client } from 'src/lib/sanity.client';
import GoogleMaps from './googleMaps';

export default async function WhereAreWe () {
  const locations = await client.fetch(`*[_type == "location"]{
    _type,
    _createdAt,
    locationName,
    mapLocation
  }`);

  return (
    <div style={{ width: '100%' }}>
      <h1>Location</h1>
      <GoogleMaps locations={ locations }/>
    </div>
  );
}