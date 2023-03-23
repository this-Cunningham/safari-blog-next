import Link from 'next/link';

export const BlueButtonLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <Link href={ href }
    className='bg-skyPrimary-800 text-base font-sans text-yellowAccent-100 py-2 px-3 sm:py-4 sm:px-7 rounded font-medium'
  >
    { children }
  </Link>
);