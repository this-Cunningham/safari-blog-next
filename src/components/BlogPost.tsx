import Link from 'next/link';

import styles from './BlogPost.module.css';
import { BlogPostBlockContent } from './BlogPostBlockContent';
import { BlogPostData } from 'src/app/interfaces_blog';
import { ImageWrapper } from './ImgWrapper';

export const BlogPost = ({ blogPost }: { blogPost: BlogPostData }) => (
  <div className={styles.blogPost}>

    <Link href={ `/blog/${blogPost.slug.current}`}>
      <h1>{ blogPost.title }</h1>
    </Link>

    <p>by: { blogPost.author.name }</p>

    <ImageWrapper src={ blogPost.mainImage.image.asset.url } alt={ blogPost.mainImage.caption } />

    <em>{ blogPost.mainImage.caption }</em>

    <BlogPostBlockContent value={ blogPost.body } />
  </div>
);