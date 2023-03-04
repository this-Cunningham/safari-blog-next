import { client } from 'src/lib/sanity.client';

import { BlogPostData } from '../interfaces_blog';
import { BlogPostTileList } from 'src/components/BlogPostTile';

export default async function BlogPostList () {
  const blogPosts: BlogPostData[] = await client.fetch(`
  *[_type == "blogPost"] | order(publishedAt desc) {
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
    categories[]->{ title, description, slug{ current } },
    excerpt,
    location->{ locationName, mapLocation },
    mainImage->{_createdAt, caption, image{ asset->{ path, url } }, author->{ name, slug } },
    publishedAt,
    slug{ current },
  }`);

  return (
    <BlogPostTileList blogPosts={ blogPosts } />
  );
};
