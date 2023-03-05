import { client } from 'src/lib/sanity.client';
import { BlogPost } from 'src/components/BlogPost';

import styles from '../BlogPostList.module.css';
import { BlogPostData } from 'src/app/interfaces_blog';

export default async function BlogPosts({ params }: { params: { blogPostSlug: string }}) {
  const { blogPostSlug } = params;

  const blogPost: BlogPostData = await client.fetch(`//groq
  *[_type == "blogPost" && slug.current == "${blogPostSlug}"][0]{
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
      _type == 'imageCollectionRef' => @->{
        _id,
        collectionName,
        collectionImages[]->{
          caption,
          image{
            asset->
          },
          imageTags
        },
      },
      _type != 'reference' => @,
    },
    tags[]->{"slug": slug.current, tagName},
    excerpt,
    location->{ locationName, mapLocation },
    mainImage->{_createdAt, caption, image{ asset->{ path, url } }, author->{ name, slug } },
    publishedAt,
    slug{ current },
  }`);

  return (
    <div className={ styles.blogPostList }>
      <BlogPost blogPost={ blogPost} key={ blogPost._id } />
    </div>
  );
}
