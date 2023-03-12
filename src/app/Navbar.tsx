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
    <nav className='h-12 sm:h-16 fixed left-0 top-0 w-full bg-skyPrimary-900 text-yellowAccent-400 flex justify-around items-center shadow-[0_4px_8px_rgba(28,35,49,.7)] text-xs sm:text-base'>
      { navBar.map((siteSection, index) => (
        <div key={ siteSection._id } className={ styles.navItem }
          style={{ animationDelay: `${(index / 4)}s`}}>
          <Link href={`/${siteSection.slug.current}`}>
            <h3>{ siteSection.siteSectionName }</h3>
          </Link>
        </div>
      ))}
    </nav>
  );
};
