import Link from 'next/link';
import { client } from 'src/lib/sanity.client';

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
    <nav
      className='h-12 sm:h-16 fixed left-0 top-0 w-full bg-skyPrimary-900 bg-opacity-95 backdrop-blur-lg text-yellowAccent-400 flex justify-around items-center shadow-[0_4px_8px_rgba(28,35,49,.7)] text-xs sm:text-base'
    >
      { navBar.map((siteSection, index) => (
        <div
          className='motion-safe:opacity-0 motion-safe:animate-fadeIn hover:underline motion-reduce:opacity-100'
          key={ siteSection._id }
          style={{ animationDelay: `${(index / 4)}s` }}
        >
          <Link href={`/${siteSection.slug.current}`}>
            <h3 className='font-serif font-normal tracking-[2px]'>{ siteSection.siteSectionName }</h3>
          </Link>
        </div>
      ))}
    </nav>
  );
};
