import styles from './BlogPost.module.css';
import { BlogPostBlockContent } from './BlogPostBlockContent';
import { BlogPostData } from 'src/app/interfaces_blog';
import { ImageWrapper } from './ImgWrapper';
import { Tag } from './Tag';

export const BlogPost = ({ blogPost }: { blogPost: BlogPostData }) => (
  <div className={styles.blogPost}>

    <h1>{ blogPost.title }</h1>

    <p>by: { blogPost.author.name }</p>

    <ImageWrapper src={ blogPost.mainImage.image.asset.url } alt={ blogPost.mainImage.caption } />

    <em>{ blogPost.mainImage.caption }</em>

    <BlogPostBlockContent value={ blogPost.body } />

    { !!blogPost.tags.length && (
      <>
        Tags: {' '}
        { blogPost.tags.map(tag => (
          <><Tag tag={ tag } key={ tag.slug } />{' '}</>
          ))}
      </>
    )}
  </div>
);