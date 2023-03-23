import Link from 'next/link';
import { ReactNode } from 'react';
import { LatestPosts } from 'src/components/BlogPostTile';

export default async function BlogPostLayout ({ children }: { children: ReactNode }) {

  return (
    <>
      <div className='relative w-full max-w-7xl my-0 mx-auto bg-skyPrimary-50 p-3 sm:p-8 rounded'>
        <Link href='/blog'
          className='absolute hidden sm:block sm:top-5 sm:left-5 font-light font-sans text-xs hover:underline'>
          {'<--'} Back to posts
        </Link>
        { children }
      </div>
      {/* @ts-expect-error Server Component */}
      <LatestPosts />
    </>
  );
};