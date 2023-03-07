import { BlogPostData } from '../interfaces_blog';
import { BlogPostTileList } from 'src/components/BlogPostTile';
import { client } from 'src/lib/sanity.client';

export default async function BlogPostList () {
  const blogPosts: BlogPostData[] = await client.fetch(`//groq
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    location->{ locationName, mapLocation },
    mainImage->{ _createdAt, caption, image{ ..., asset-> }, author->{ name, slug } },
    publishedAt,
    slug{ current },
  }`);

  return (
    <BlogPostTileList blogPosts={ blogPosts } />
  );
};
