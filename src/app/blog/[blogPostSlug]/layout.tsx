import Link from 'next/link';
import { ReactNode } from 'react';

import { BackArrow } from 'src/components/atoms/ArrowSvgs';
import { LatestPosts } from 'src/components/BlogPostTile';

export default async function BlogPostLayout ({ children }: { children: ReactNode }) {

  return (
    <>
      <div className='relative w-full max-w-7xl my-0 mx-auto bg-skyPrimary-50 p-3 sm:p-8 rounded'>
        <Link href='/blog'
          className='absolute hidden sm:flex sm:items-center sm:gap-4 sm:top-5 sm:left-5 font-light font-sans text-xs hover:underline decoration-skyPrimary-700 text-skyPrimary-700'>
            <BackArrow size={ 30 } color='#0369a1' /> Back to Blog Posts
        </Link>
        { children }
      </div>
      {/* @ts-expect-error Server Component */}
      <LatestPosts />
    </>
  );
};