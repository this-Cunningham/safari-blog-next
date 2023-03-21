'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SiteSection } from 'src/app/interfaces_blog';
import { useScrollPosition } from 'src/hooks/useScrollPosition';
import { SafariWireLogo } from './supplemental/SafariWireLogo';

const NavItem = (
  { siteSection, isScrolled }:
  { siteSection: SiteSection; isScrolled: boolean }
) => {
  const pathname = usePathname();

  // useCallback and useMemo here to only run this code when "isScrolled" or "pathname" changes
  const getNavItemStyling = useCallback((slugString: string) => {
    const predicate = slugString == 'safari' // this means home "/"
      ? pathname == '/'
      : pathname?.startsWith(`/${slugString}`);

    return predicate
      ? `underline decoration-2 underline-offset-8 ${
        isScrolled
          ? 'text-yellowAccent-100 decoration-8'
          : 'text-skyPrimary-600'
        } `
      : 'text-black hover:underline hover:underline-offset-8';
  }, [isScrolled, pathname]);

  const navItemStyle = useMemo(() => {
    return getNavItemStyling(siteSection.slug.current);
  }, [getNavItemStyling, siteSection.slug]);

  return (
     <Link href={ siteSection.slug.current == 'safari' ? '/' : `/${siteSection.slug.current}` }
        className={ `${navItemStyle} relative` }
      >
      { siteSection.slug.current === 'safari' && (
        <SafariWireLogo
          width={ 130 } height={ 163 }
          className='w-auto h-16 absolute -right-7 -top-6'
        />
      )}

      { siteSection.siteSectionName.toUpperCase() }

    </Link>
  );
};

export default function NavBar ({ navBar }: { navBar: SiteSection[] }) {
  const [safariHome, ...navItems] = navBar;
  const scrollY = useScrollPosition();

  return (
    <nav className={`
      w-full fixed left-0 top-0
      ${ scrollY > 0
        ? 'bg-[#93c5fd] drop-shadow-md'
        : 'bg-transparent'
      }
    `}
    >
      <div className='max-w-[1440px] mx-auto px-4 sm:px-12 h-16 sm:h-28 text-black flex justify-between items-center sm:text-xl font-serif tracking-normal lg:tracking-[2px] shrink-0'>
        <div>
          <NavItem siteSection={ safariHome }
            isScrolled={ scrollY > 0 }
            key={ safariHome._id }
          />
        </div>

        <div className='flex justify-end gap-6 md:gap-10 lg:gap-20'>
          { navItems.map((siteSection) => (
            <NavItem siteSection={siteSection}
              isScrolled={ scrollY > 0 }
              key={ siteSection._id }
            />
          ))}
        </div>
      </div>
    </nav>
  );
}