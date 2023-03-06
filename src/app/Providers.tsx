'use client';

import { createContext, Dispatch, SetStateAction, useState } from 'react';

type SiteSectionNavSlug = 'safari'| 'blog' |  'photos' | 'where-are-we' | 'about-us';

const NavContext = createContext<[SiteSectionNavSlug, any]>(['blog', null]);
// const SidebarContext = createContext<null | {}>(null);

export const NavAndSideBarProviders = ({ children }: { children: React.ReactNode }) => {
  const [selectedNavItem, setSelectedNavItem] = useState<SiteSectionNavSlug>('blog');
  // const [sidebarState, setSideBarState] = useState({
  //   tags: null,
  //   searchText: '',
  // });

  return (
    <NavContext.Provider value={ [
      selectedNavItem, (setSelectedNavItem) as Dispatch<SetStateAction<SiteSectionNavSlug>>
    ] }>
      {/* <SidebarContext.Provider value={ sidebarState }> */}
        { children }
      {/* </SidebarContext.Provider> */}
    </NavContext.Provider>
  );
};