import { BlogImage, BlogPostData } from 'src/app/interfaces_blog';
import { BlogPostTileList } from 'src/components/BlogPostTile';
import { ImageTileList } from 'src/components/ImageTile';
import { client } from 'src/lib/sanity.client';

export default async function TagPage ({ params }: { params: { tagSlug: string }}) {
  const taggedImages: BlogImage[] = await client.fetch(`
    *[_type == 'blogImage' && "${params.tagSlug}" in tags[]->.slug.current]{
      _id,
      image{ ..., asset->},
      caption,
      tags[]->
    }
  `);

  const taggedBlogs: BlogPostData[] = await client.fetch(`//groq
    *[_type == "blogPost" && "${params.tagSlug}" in [
      ...tags[]->.slug.current,
      ...mainImage->.tags[]->.slug.current,
      ...body[]{_type == 'imageCollectionRef' => @->}.collectionImages[]->.tags[]->.slug.current
    ]] | order(publishedAt desc) {
      _id,
      title,
      excerpt,
      mainImage->{ _createdAt, caption, image{ ..., asset-> }, author->{ name, slug } },
      publishedAt,
      slug{ current },
    }
  `);

  return (
    <>
      <h1 className='text-center'>#{params.tagSlug} blog posts</h1>
      <BlogPostTileList blogPosts={ taggedBlogs } />
      <h1 className='text-center'>#{params.tagSlug} photos</h1>
      <ImageTileList photos={ taggedImages } />
    </>
  );
}