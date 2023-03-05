import { client } from 'src/lib/sanity.client';
import { BlogPost } from 'src/components/BlogPost';

import styles from '../BlogPostList.module.css';
import { AllTags, BlogPostData, TagInterface } from 'src/app/interfaces_blog';

export default async function BlogPosts({ params }: { params: { blogPostSlug: string }}) {
  const { blogPostSlug } = params;

  // prefer to do Page not found div if blogPost == null (see below in this file)
  if ('[blogPostSlug]' == decodeURIComponent(blogPostSlug)) {
    return <div></div>;
  }

  // bug here with trying to get first item in groq query... Needs this early return above since the literal string "[blogPostSlug]" is given to const blogPostSlug from params... and it returns null from groq query when this is the case
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
        tags[]->{"slug": slug.current, tagName},
      },
      _type == 'imageCollectionRef' => @->{
        _id,
        collectionName,
        collectionImages[]->{
          caption,
          image{
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
    mainImage->{_createdAt, caption, image{ asset->{ path, url } }, author->{ name, slug }, tags[]->{"slug": slug.current, tagName} },
    publishedAt,
    slug{ current },
    "allTags": {
      "blogTags": tags[]->{"slug": slug.current, tagName},

      "mainImageTags": mainImage->.tags[]->{"slug": slug.current, tagName},

      "imageCollectionTags": body[]{
        _type == 'imageCollectionRef' => @->,
      }.collectionImages[]->.tags[]->{"slug": slug.current, tagName},
    }
  }`);

  if (blogPost == null) {
    return <div>Page not found</div>;
  }

const getUniqueTags = (allTags: AllTags) => {
  // filter out null here because groq query returns null when parts of "body[]" are not _type="imageCollectionRef"
  allTags.imageCollectionTags = allTags.imageCollectionTags.filter(tag => tag !== null);

  const uniqueTags: TagInterface[] = Array.from(new Set(
    Object.values(allTags).flat().filter(tag => tag !== null).map(tag => JSON.stringify(tag))
    )).map(tag => JSON.parse(tag));

    return uniqueTags;
  };

  return (
    <div className={ styles.blogPostList }>
      {
        // blogPosts.map(blogPost => (
          <BlogPost blogPost={ { ...blogPost, tags: getUniqueTags(blogPost.allTags) }} key={ blogPost._id } />
        // ))
      }
    </div>
  );
}
