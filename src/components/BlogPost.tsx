import Image from 'next/image';

import { BlogPostBlockContent } from './BlogPostBlockContent';
import { DateFormatter } from './DateFormatted';
import { Tag } from './Tag';
import { BlogPostData } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

export const BlogPost = ({ blogPost }: { blogPost: BlogPostData }) => (
  <div className='w-full max-w-[720px] my-0 mx-auto'>

    <DateFormatter className='text-center font-serif mb-6'
      dateString={ blogPost.publishedAt }
    />

    <h1 className='text-3xl sm:text-5xl font-serif font-normal text-center mb-11'>
      { blogPost.title }
    </h1>

    <div className='space-y-4'>
      <Image
        className='w-full h-auto rounded'
        src={ urlFor(blogPost.mainImage.image).quality(100).url() }
        priority
        height={ 720 / blogPost.mainImage.image.asset.metadata.dimensions.aspectRatio }
        width={ 720 }
        placeholder='blur'
        blurDataURL={ blogPost.mainImage.image.asset.metadata.lqip }
        alt={ blogPost.mainImage.caption ?? 'Blog post main image'}
      />

      <p className='text-xs my-1 font-light'>{ blogPost.mainImage.caption }</p>

      <BlogPostBlockContent value={ blogPost.body } />

      { !!blogPost.tags?.length && (
        <div className='text-sm'>
          Tags: {' '}
          { blogPost.tags.map(tag => <Tag tag={ tag } key={ 'slug-' + blogPost._id } /> )}
        </div>
      )}
    </div>
  </div>
);