import Link from 'next/link';
import { client } from 'src/lib/sanity.client';

import styles from './Navbar.module.css';

interface SiteSection {
  _type: 'siteSection';
  _id: string;
  siteSectionName: string;
  slug: {
    current: string;
  }
}

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
    <nav className={ styles.navbar }>
      { navBar.map((siteSection, index) => (
        <div key={ siteSection._id } className={ styles.navItem }
          style={{ animationDelay: `${(index / 3)}s`}}>
          <Link href={siteSection.slug.current}>
            <h3>{ siteSection.siteSectionName }</h3>
          </Link>
        </div>
      ))}
    </nav>
  );
};
