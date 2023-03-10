import Image from 'next/image';

import styles from './BlogPost.module.css';
import { BlogPostBlockContent } from './BlogPostBlockContent';
import { Tag } from './Tag';
import { BlogPostData } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

export const BlogPost = ({ blogPost }: { blogPost: BlogPostData }) => (
  <div className={styles.blogPost}>

    <h1>{ blogPost.title }</h1>

    <p>by: { blogPost.author.name }</p>

    <Image
      src={ urlFor(blogPost.mainImage.image).quality(100).url() }
      priority
      height={ blogPost.mainImage.image.asset.metadata.dimensions.height }
      width={ blogPost.mainImage.image.asset.metadata.dimensions.width }
      placeholder='blur'
      blurDataURL={ blogPost.mainImage.image.asset.metadata.lqip }
      alt={ blogPost.mainImage.caption }
      className={ styles.nextBlogPostMainImage }
    />

    <em>{ blogPost.mainImage.caption }</em>

    <BlogPostBlockContent value={ blogPost.body } />

    { !!blogPost.tags.length && (
      <>
        Tags: {' '}
        { blogPost.tags.map(tag => <Tag tag={ tag } key={ tag.slug } /> )}
      </>
    )}
  </div>
);