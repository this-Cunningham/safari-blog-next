import { client } from 'src/lib/sanity.client';
import Link from 'next/link';
import { BlogPost } from './interfaces_blog';

import styles from './BlogPostList.module.css';
import { PortableText } from '@portabletext/react';

interface BlockContentImg {
  _type: 'blogImageRef';
  image: {
    asset: {
      url: string;
    }
  }
}
const BlogImageBlockContent = ({ value }: { value: BlockContentImg; isInline?: boolean }) => {
  return (
    <img src={ value.image.asset.url} alt="" style={{ width: '50%'}}/>
  );
};

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
