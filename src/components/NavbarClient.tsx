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
    ? `underline decoration-8 underline-offset-8 ${!!scrollY ? 'text-white' : 'text-skyPrimary-600'} transition-all duration-300`
    : 'text-black';
  };

  return (
    <nav className={`
    w-full fixed left-0 top-0
    ${
      !!scrollY
        ? 'bg-skyPrimary-700 shadow-[0_4px_8px_rgba(28,35,49,.7)]'
        : 'bg-transparent'
    }
    transition-all duration-300
    `}
    >
      <div className='max-w-[1440px] mx-auto px-4 sm:px-12 h-16 sm:h-28  text-black flex justify-between items-center sm:text-xl'>

        <div className={ `hover:underline hover:underline-offset-8 ${getNavItemStyling(safariHome.slug.current)}` }>
          <Link href={`/${safariHome.slug.current}`}>
            <h3 className='font-serif tracking-[2px]'>{ safariHome.siteSectionName }</h3>
          </Link>
        </div>

        <div className='flex justify-end gap-10 w-3/5'>
          { navItems.map((siteSection) => (
            <Link
              href={`/${siteSection.slug.current}`}
              key={ siteSection._id }
              className={ `font-serif tracking-[2px] hover:underline hover:underline-offset-8 shrink-0 ${getNavItemStyling(siteSection.slug.current)}`}
            >
              { siteSection.siteSectionName }
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}