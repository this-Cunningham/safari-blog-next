import Link from 'next/link';
import { PortableText } from '@portabletext/react';

import styles from './BlogPost.module.css';
import { BlogImageBlockContent } from './PortableText';
import { BlogPostData as BlogPostData } from 'src/app/interfaces_blog';

export const BlogPost = ({ blogPost }: { blogPost: BlogPostData }) => (
  <div className={styles.blogPost}>

    <Link href={ `/blog/${blogPost.slug.current}`}>
      <h1>{ blogPost.title }</h1>
    </Link>

    <p>by: { blogPost.author.name }</p>

    <img src={ blogPost.mainImage.image.asset.url } alt={ blogPost.mainImage.caption } />

    <em>{ blogPost.mainImage.caption }</em>

    <PortableText
      value={ blogPost.body }
      components={{
        types: { blogImageRef: BlogImageBlockContent }
      }}
    />
  </div>
);