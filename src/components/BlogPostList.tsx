import { client } from 'src/lib/sanity.client';

import { BlogPost } from './interfaces_blog';

import styles from './BlogPostList.module.css';

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
    <div>
      { blogPosts.map(blogPost => (
        <div key={ blogPost._id } className={styles.blogPost}>
          <h1>{ blogPost.title }</h1>
          <img src={ blogPost.mainImage.image.asset.url } alt={ blogPost.mainImage.caption } />
          <p>{ blogPost.mainImage.caption }</p>
          <p>{ blogPost.excerpt }</p>
        </div>
      ))}
    </div>
  );
};