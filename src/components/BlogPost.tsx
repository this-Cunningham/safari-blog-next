import Image from 'next/image';

import { BlogPostBlockContent } from './BlogPostBlockContent';
import { Tag } from './Tag';
import { BlogPostData } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

export const BlogPost = ({ blogPost }: { blogPost: BlogPostData }) => (
  <div className='p-0 w-full max-w-[720px] my-0 mx-auto'>

    <h1 className='text-2xl leading-6'>{ blogPost.title }</h1>

    <p className='text-xs font-light'>by: { blogPost.author.name }</p>

    <Image
      className='w-full h-auto rounded'
      src={ urlFor(blogPost.mainImage.image).quality(100).url() }
      priority
      height={ 720 / blogPost.mainImage.image.asset.metadata.dimensions.aspectRatio }
      width={ 720 }
      placeholder='blur'
      blurDataURL={ blogPost.mainImage.image.asset.metadata.lqip }
      alt={ blogPost.mainImage.caption }
    />

    <p className='text-xs my-1 font-light'>{ blogPost.mainImage.caption }</p>

    <BlogPostBlockContent value={ blogPost.body } />

    { !!blogPost.tags.length && (
      <div className='text-sm'>
        Tags: {' '}
        { blogPost.tags.map(tag => <Tag tag={ tag } key={ tag.slug } /> )}
      </div>
    )}
  </div>
);