'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SiteSection } from 'src/app/interfaces_blog';
import { useIsScrolled } from 'src/hooks/useIsScrolled';
import { SafariWireLogo } from './supplemental/SafariWireLogo';
import { useScreenWidth } from 'src/hooks/useScreenWidth';
import { SquashHamburger } from './Hamburger';

const NavItem = (
  { siteSection, isScrolled, collapseMobileNav }:
  { siteSection: SiteSection; isScrolled: boolean; collapseMobileNav?: () => void }
) => {
  const pathname = usePathname();

  // useCallback and useMemo here to only run this code when "isScrolled" or "pathname" changes
  const getNavItemStyling = useCallback((slugString: string) => {
    const siteSectionIsSelectedPredicate = slugString == 'safari' // this means home "/"
      ? pathname == '/'
      : pathname?.startsWith(`/${slugString}`);

    return siteSectionIsSelectedPredicate
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
      onClick={ collapseMobileNav }
      className={ `${navItemStyle} relative` }
    >
      { siteSection.slug.current === 'safari' && (
        <SafariWireLogo
          width={ 130 } height={ 163 }
          className='w-auto h-16 absolute -right-7 -top-6 hidden sm:block'
        />
      )}

      { siteSection.siteSectionName.toUpperCase() }

    </Link>
  );
};

export default function NavBar ({ navBar }: { navBar: SiteSection[] }) {
  const [safariHome, ...navItems] = navBar;
  const isScrolled = useIsScrolled();
  const screenWidth = useScreenWidth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const isMobile = screenWidth < 640;

  const getHamburgerColor = () => {
      if (pathname !== '/') {
        return isScrolled ? '#fef9c3' : '#0284c7';
      } else {
        return '#1d1d1d';
      }
  };

  return (
    <nav className={`
      w-full fixed left-0 top-0
      ${ isScrolled
        ? 'bg-[#93c5fd] shadow-optimized-high-height'
        : `${isMobile && !collapsed ? 'bg-yellowAccent-50 shadow-optimized-high-height' : 'bg-yellowAccent-50'}`
      }
    `}>
      <div className='max-w-[1440px] flex flex-col mx-auto text-black text-2xl font-bold sm:font-normal sm:text-xl font-serif tracking-normal lg:tracking-[2px] px-8 sm:px-12'>
        <div className='min-h-[64px] sm:h-28 flex justify-between items-center shrink-0'>
          <div>
            <NavItem siteSection={ safariHome }
              isScrolled={ isScrolled }
              key={ safariHome._id }
              collapseMobileNav={ () => setCollapsed(true) }
            />
          </div>

          { screenWidth !== 0 && isMobile && (
            <SquashHamburger
              color={ getHamburgerColor() }
              onToggle={ () => setCollapsed(prev => !prev)}
              toggled={ !collapsed }
            />
          ) }
          { !isMobile && (
            <div className='flex justify-end gap-6 md:gap-10 lg:gap-20'>
              { navItems.map((siteSection) => (
                <NavItem siteSection={siteSection}
                  isScrolled={ isScrolled }
                  key={ siteSection._id }
                />
              ))}
            </div>
          )}
        </div>

        { isMobile && !collapsed && (
          // this is the dropdown menu from clicking on hamburger
          <div className={ `flex flex-col gap-4 text-base pb-4
            ${isScrolled
              ? 'bg-[#93c5fd]'
              : 'bg-yellowAccent-50'}
          `}>
            { navItems.map((siteSection) => (
              <NavItem siteSection={siteSection}
                isScrolled={ isScrolled }
                key={ siteSection._id }
                collapseMobileNav={ () => setCollapsed(true) }
              />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}