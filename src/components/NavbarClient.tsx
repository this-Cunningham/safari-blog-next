'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollPosition } from 'src/hooks/useScrollPosition';
import { SiteSection } from '../app/interfaces_blog';

export default function NavBar ({ navBar }: { navBar: SiteSection[] }) {
  const [safariHome, ...navItems] = navBar;
  const pathname = usePathname();
  const scrollY = useScrollPosition();

  const getNavItemStyling = (slugString: string) => {
    return pathname?.startsWith(`/${slugString}`)
    ? `underline decoration-2 underline-offset-8 ${
      !!scrollY
        ? 'text-yellowAccent-100 decoration-8'
        : 'text-skyPrimary-600'
      } `
    : 'text-black hover:underline hover:underline-offset-8';
  };

  return (
    <nav className={`
      w-full fixed left-0 top-0
      ${
        !!scrollY
          ? 'bg-[#93c5fd] drop-shadow-md'
          : 'bg-transparent'
      }
    `}
    >
      <div className='max-w-[1440px] mx-auto px-4 sm:px-12 h-16 sm:h-28 text-black flex justify-between items-center sm:text-xl font-serif tracking-normal lg:tracking-[2px] shrink-0'>

        <div className={ `${getNavItemStyling(pathname == '/' ? '': 'NOT-HOME')}` }>
          <Link href='/'>
            <h3 className=''>{ safariHome.siteSectionName }</h3>
          </Link>
        </div>

        <div className='flex justify-end gap-6 lg:gap-20'>
          { navItems.map((siteSection) => (
            <Link
              href={`/${siteSection.slug.current}`}
              key={ siteSection._id }
              className={ `${getNavItemStyling(siteSection.slug.current)}`}
            >
              { siteSection.siteSectionName }
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}