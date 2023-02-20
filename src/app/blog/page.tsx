import { client } from 'src/lib/sanity.client';

import styles from './BlogPostList.module.css';
import { BlogPostData } from '../interfaces_blog';
import { BlogPost } from 'src/components/BlogPost';

export default async function BlogPostList () {
  const blogPosts: BlogPostData[] = await client.fetch(`
  *[_type == "blogPost"]{
    _id,
    title,
    author->{
      name,
      slug{ current },
      bio,
      authorImage{ asset->{path, url} }
    },
    body[]{
      _type == 'blogImageRef' => @->{
        caption,
        image{
          asset->
        },
        imageTags
      },
      _type != 'reference' => @,
    },
    categories[]->{ title, description, slug{ current } },
    excerpt,
    location->{ locationName, mapLocation },
    mainImage->{_createdAt, caption, image{ asset->{ path, url } }, author->{ name, slug } },
    publishedAt,
    slug{ current },
  }`);

  return (
    <div className={ styles.blogPostList }>
      { blogPosts.map(blogPost => (
        <BlogPost blogPost={ blogPost } key={ blogPost._id } />
      ))}
    </div>
  );
};
