import { PortableText } from '@portabletext/react';
import Link from 'next/link';

import { BlogImageBlockContent } from 'src/components/PortableText';
import { client } from 'src/lib/sanity.client';

import styles from './BlogPostList.module.css';
import { BlogPost } from '../interfaces_blog';

export default async function BlogPostList () {
  const blogPosts: BlogPost[] = await client.fetch(`*[_type == "blogPost"]{
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
        <div key={ blogPost._id } className={styles.blogPost}>
          <Link href={ `/blog/${blogPost.slug.current}`}>
            <h1>{ blogPost.title }</h1>
          </Link>
          <p style={{ paddingLeft: '8px'}}>by: { blogPost.author.name }</p>
          <img src={ blogPost.mainImage.image.asset.url } alt={ blogPost.mainImage.caption } />
          <em>{ blogPost.mainImage.caption }</em>
          <PortableText
            value={ blogPost.body }
            components={{
              types: { blogImageRef: BlogImageBlockContent }
            }}
          />
        </div>
      ))}
    </div>
  );
};
