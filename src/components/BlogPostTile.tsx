import Link from 'next/link';
import Image from 'next/image';

import styles from './BlogPostTile.module.css';
import { DateFormatter } from './DateFormatted';
import { BlogPostData } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

const BlogPostTile = ({ blogPost }: { blogPost: BlogPostData }) => (
  <div className={styles.blogPostTile}>
    <Image
      src={ urlFor(blogPost.mainImage.image).height(600).width(600*1.77).quality(100).url() }
      alt={ blogPost.mainImage.caption }
      height={640}
      width={640*1.77}
      key={ blogPost._id }
    />

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