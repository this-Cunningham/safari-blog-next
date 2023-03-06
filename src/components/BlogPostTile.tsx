import Link from 'next/link';

import { BlogPostData } from 'src/app/interfaces_blog';
import { ImageWrapper } from './ImgWrapper';
import styles from './BlogPostTile.module.css';
import { DateFormatter } from './DateFormatted';

const BlogPostTile = ({ blogPost }: { blogPost: BlogPostData }) => (

  <div className={styles.blogPostTile}>
    <ImageWrapper src={ blogPost.mainImage.image.asset.url } alt={ blogPost.mainImage.caption } />

    <div className={ styles.contentContainer }>
      <DateFormatter dateString={ blogPost.publishedAt } className={ styles['blog-tile-date'] } />
      <h3>{ blogPost.title }</h3>

      <p>{blogPost.excerpt}</p>

      <Link href={ `/blog/${blogPost.slug.current}`}>
        Read more
      </Link>
    </div>

  </div>
);

export const BlogPostTileList = ({ blogPosts }: { blogPosts: BlogPostData[] }) => (
  <div className={ styles.blogPostTileList }>
    { blogPosts.map(blogPost => (
      <BlogPostTile blogPost={ blogPost } key={ blogPost._id }/>
    )) }
  </div>
);