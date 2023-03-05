import { client } from 'src/lib/sanity.client';
import { BlogPost } from 'src/components/BlogPost';

import styles from '../BlogPostList.module.css';
import { AllTags, BlogPostData, TagInterface } from 'src/app/interfaces_blog';

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
  }`);

  const allTags: AllTags = await client.fetch(`//groq
    *[_type == "blogPost" && _id == "${blogPost._id ?? null}"][0]{
      "blogTags": tags[]->{"slug": slug.current, tagName},

      "mainImageTags": mainImage->.tags[]->{"slug": slug.current, tagName},

      "imageCollectionTags": body[]{
        _type == 'imageCollectionRef' => @->,
      }.collectionImages[]->.tags[]->{"slug": slug.current, tagName},
    }
`);

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
      <BlogPost blogPost={ { ...blogPost, tags: getUniqueTags(allTags) }} key={ blogPost._id } />
    </div>
  );
}
