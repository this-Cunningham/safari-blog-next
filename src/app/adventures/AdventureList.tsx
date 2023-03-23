'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from 'src/components/atoms/IconifyClientWrapper';

import { Adventure } from '../interfaces_blog';

export const AdventureList = ({ adventures, currentAdventureSlug, currentLocationSlug }: { adventures: Adventure[]; currentAdventureSlug: string; currentLocationSlug: string }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
      const updateScreen = () => setScreenWidth(window.innerWidth);
      updateScreen();
      window.addEventListener('resize', updateScreen);
      return () => window.removeEventListener('resize', updateScreen);
  }, []);

  const isMobile = screenWidth < 768;

  const selectedAdventure = useMemo(() => {
    return adventures.filter(({ adventureSlug }) => (
      adventureSlug.current == currentAdventureSlug)
    )[0];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAdventureSlug]);

  return (
    <div className='md:w-72 xl:w-96 bg-skyPrimary-100 rounded drop-shadow-md pt-0 max-h-[400px] overflow-scroll'>
      <button className='font-bold text-xl sm:text-2xl text-center w-full cursor-pointer hover:underline sticky top-0 bg-skyPrimary-100 p-4'
        onClick={ () => setCollapsed(prev => !prev) }
      >
        { selectedAdventure.adventureName }

        { collapsed && (
            <Icon icon="mdi:chevron-down" width='40' height='40' className='inline-block' />
        )}

        { !collapsed && (
            <Icon icon="mdi:chevron-up" width='40' height='40' className='inline-block'/>
        ) }
      </button>

        {/* list of locations in an adventure */}
        { collapsed && !isMobile && (
          <ul className='flex flex-col gap-3 items-center'>
            { selectedAdventure.adventureBlogPosts.map(({ location }, index) => (
              <li key={ location._id + index }>
                <Link
                  className={ `font-sans leading-5 font-normal text-black hover:underline
                    ${ currentLocationSlug === location.slug.current ? 'underline' : ''}
                  `}
                  href={ `/adventures/${currentAdventureSlug}/${location.slug.current}` }
                >
                  { index + 1 + '. ' + location.locationName }
                </Link>
              </li>
            ))}
          </ul>
        )}

        { !collapsed && (
          <ul className='flex flex-col gap-3 items-center p-4 pt-0'>
            { adventures.map((adventure, index) => (
              <li key={ adventure._id }>
                <Link
                  className={ `font-sans leading-5 font-normal text-black hover:underline
                    ${ currentAdventureSlug === adventure.adventureSlug.current ? 'underline' : ''}
                  `}
                  href={ `/adventures/${adventure.adventureSlug.current}` }
                >
                  { adventure.adventureName } { index == 0 && ' (current)'}
                </Link>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
};
