import Image from 'next/image';
import styles from './BlogPostList.module.css';
import { client } from 'src/lib/sanity.client';
import { BlogPost } from './interfaces_blog';

export const BlogPostList = async () => {
  const blogPosts: BlogPost[] = await client.fetch(`*[_type == "blogPost"]{
    _id,
    title,
    author->{
      name,
      slug{ current },
      bio,
      authorImage{ asset->{path, url} }
    },
    body,
    categories[]->{ title, description, slug{ current } },
    excerpt,
    location->{ locationName, mapLocation },
    mainImage->{_createdAt, caption, image{ asset->{ path, url } }, author->{ name, slug } },
    publishedAt,
    slug{ current },
  }`);

  return (
    <>
      { blogPosts.map(blogPost => (
        <div key={ blogPost._id } className={styles.blogPost}>
          <h1>{ blogPost.title }</h1>
          <Image alt={ blogPost.mainImage.caption } width={750} height={500} src={ blogPost.mainImage.image.asset.url}/>
        </div>
      ))}
    </>
  );
};