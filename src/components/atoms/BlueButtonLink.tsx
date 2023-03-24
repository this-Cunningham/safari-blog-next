import Link from 'next/link';

import { AtomBase } from './interfaces_atoms';

interface BlueButtonLinkProps extends AtomBase {
  href: string;
}

export const BlueButtonLink = ({ children, className, href }: BlueButtonLinkProps) => (
  <Link href={ href }
    className={ `block w-fit h-fit mx-auto sm:mx-0 bg-skyPrimary-800 text-base font-sans text-yellowAccent-100 py-4 px-7 rounded font-medium ${ className }` }
  >
    { children }
  </Link>
);