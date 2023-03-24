import { AtomBase } from './interfaces_atoms';

export const Subheadline = ({ children, className }: AtomBase) => (
  <h3 className={ `font-serif text-2xl sm:text-5xl sm:leading-[65px] text-center sm:text-left mb-6 lg:mb-14 ${ className }` }>
    { children }
  </h3>
);

export const SiteSectionHeader = ({ children, className }: AtomBase) => (
  <h1 className={ `text-center sm:text-left text-3xl sm:text-5xl md:text-7xl font-serif font-normal mb-4 sm:mb-8 md:mb-10 ${className}` }>
    { children }
  </h1>
);