import { client } from 'src/lib/sanity.client';
import { BlogPost } from 'src/components/BlogPost';

import styles from '../BlogPostList.module.css';
import { AllTags, BlogPostData, TagInterface } from 'src/app/interfaces_blog';

// Return a list of `params` to populate the [blogPostSlug] dynamic segment
// "generateStaticParams" is static rendering each of these dynamic routes at build time!
export async function generateStaticParams() {
  const blogPosts: BlogPostData[] = await client.fetch(`//groq
  *[_type == "blogPost"] {
    slug{ current },
  }`);

  return blogPosts.map((post) => ({
    blogPostSlug: post.slug.current,
  }));
}

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
            ...,
            asset->
          },
          tags[]->{"slug": slug.current, tagName},
        },
        _type == 'imageCollectionRef' => @->{
          _id,
          collectionName,
          collectionImages[]->{
            caption,
            image{
              ...,
              asset->
            },
            tags[]->{"slug": slug.current, tagName},
          },
        },
        _type != 'reference' => @,
      },
      tags[]->{"slug": slug.current, tagName},
      excerpt,
      location->{ locationName, mapLocation },
      mainImage->{_createdAt, caption, image{ ..., asset-> }, author->{ name, slug }, tags[]->{"slug": slug.current, tagName} },
      publishedAt,
      slug{ current },
      "allTags": array::compact([
        ...tags[]->{ "slug": slug.current, tagName },
        ...mainImage->.tags[]->{ "slug": slug.current, tagName },
        ...body[]{
          _type == 'imageCollectionRef' => @->
        }.collectionImages[]->.tags[]->{ "slug": slug.current, tagName }
      ])
    }
  `);

  if (blogPost == null) {
    return (<h2> Page not found </h2>);
  }

  const getUniqueTags = (allTags: AllTags) => {
    const uniqueTags: TagInterface[] = Array.from(
      new Set(
        Object.values(allTags)
        .map(tag => JSON.stringify(tag))
      )
    ).map(tag => JSON.parse(tag));

    return uniqueTags;
  };

  return (
    <div className={ styles.blogPostList }>
      <BlogPost key={ blogPost._id }
        blogPost={{
          ...blogPost,
          tags: getUniqueTags(blogPost.allTags),
        }}
      />
    </div>
  );
}
