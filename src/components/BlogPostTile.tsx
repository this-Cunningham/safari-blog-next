import Link from 'next/link';
import Image from 'next/image';

import { DateFormatter } from './DateFormatted';
import { BlogPostData } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

const BlogPostTile = ({ blogPost, index }: { blogPost: BlogPostData; index: number }) => (
  <div className='group flex flex-col items-center grow w-80 text-center bg-skyPrimary-100 rounded drop-shadow-md'>
    <Link href={ `/blog/${blogPost.slug.current}`} className='w-full h-full'>
      <Image
        className='rounded-t rounded-b-none'
        src={ urlFor(blogPost.mainImage.image).height(500).width(500*1.77).quality(100).url() }
        height={ 500 }
        width={ 500*1.77 }
        placeholder='blur'
        blurDataURL={ blogPost.mainImage.image.asset.metadata.lqip }
        alt={ blogPost.mainImage.caption }
        priority={ index < 6 }
      />

      <div className='p-6'>
        <h3 className='group-hover:underline font-serif font-semibold text-xl'>{ blogPost.title }</h3>

        <DateFormatter dateString={ blogPost.publishedAt }
          className='text-xs tracking-wider font-light my-2'
        />

        <p className='text-s m-2'>{ blogPost.excerpt }...</p>
      </div>
    </Link>
  </div>
);

export const BlogPostTileList = ({ blogPosts }: { blogPosts: BlogPostData[] }) => (
  <div className='flex flex-wrap gap-12 after:w-80 after:flex-grow'>
    { blogPosts.map((blogPost, index) => (
      <BlogPostTile blogPost={ blogPost } key={ blogPost._id } index={ index } />
    )) }
  </div>
);