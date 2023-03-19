import { client } from 'src/lib/sanity.client';
import { SiteSection } from 'src/app/interfaces_blog';
import NavbarClient from './NavbarClient';

export const Navbar = async () => {
  const [{ siteSectionItems: navBar }] = await client.fetch<[{ siteSectionItems: SiteSection[] }]>(`*[_type == "siteSections"]{
    siteSectionItems[]->{
      _id,
      _type,
      siteSectionName,
      slug{current}
    }
  }`);

  return (
    <NavbarClient navBar={ navBar } />
  );
};
