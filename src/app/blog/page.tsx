import { BlogPostData } from 'src/app/interfaces_blog';
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
    <>
      <h1 className='text-4xl sm:text-7xl font-serif font-normal mb-4 sm:mb-10'> Blog Posts </h1>
      <BlogPostTileList blogPosts={ blogPosts } />
    </>
  );
};
