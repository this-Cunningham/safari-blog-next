import Link from 'next/link';
import Image from 'next/image';

import { DateFormatter } from './DateFormatted';
import { BlogPostData } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

const BlogPostTile = ({ blogPost, index }: { blogPost: BlogPostData; index: number }) => (
  <div className='flex flex-col items-center grow w-80 text-center p-7 bg-skyPrimary-100 rounded drop-shadow-md'>
    <Link href={ `/blog/${blogPost.slug.current}`} className='w-full h-auto'>
      <Image
        className='rounded'
        src={ urlFor(blogPost.mainImage.image).height(500).width(500*1.77).quality(100).url() }
        height={ 500 }
        width={ 500*1.77 }
        placeholder='blur'
        blurDataURL={ blogPost.mainImage.image.asset.metadata.lqip }
        alt={ blogPost.mainImage.caption }
        priority={ index < 6 }
      />

      <div className='p-4'>
        <h3 className='font-semibold'>{ blogPost.title }</h3>
        <DateFormatter dateString={ blogPost.publishedAt }
          className='text-xs tracking-wider my-2'
        />
          <p className='text-xs m-2'>{ blogPost.excerpt }...</p>
      </div>
    </Link>
  </div>
);

export const BlogPostTileList = ({ blogPosts }: { blogPosts: BlogPostData[] }) => (
  <div className='flex flex-wrap gap-8 after:w-80 after:flex-grow'>
    { blogPosts.map((blogPost, index) => (
      <BlogPostTile blogPost={ blogPost } key={ blogPost._id } index={ index } />
    )) }
  </div>
);