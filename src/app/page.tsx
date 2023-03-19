import { BlogPostTile } from 'src/components/BlogPostTile';
import { urlFor } from 'src/lib/imageUrlBuilder';
import { client } from 'src/lib/sanity.client';
import { BlogImage, BlogPostData } from './interfaces_blog';

export default async function Home() {
  const heroImage: BlogImage = await client.fetch(`//groq
    *[_id == 'edf1aa5d-9cfd-4bb3-8a64-66d3074bd932'][0]{
      ...,
      image{
        asset->,
      },
      location->,
    }
  `);

  const mostRecentBlog: BlogPostData = await client.fetch(`//groq
    *[_type == 'blogPost'] | order(publishedAt desc) [0] {
      _id,
      title,
      excerpt,
      location->{ locationName, mapLocation },
      mainImage->{ _createdAt, caption, image{ ..., asset-> }, author->{ name, slug } },
      publishedAt,
      slug{ current },
    }
  `);

  return (
    <>
      <div
        style={{
          backgroundImage: `url("${urlFor(heroImage.image).width(1800).quality(100).auto('format').url()}")`
        }}
        className='
          relative
          rounded
          h-[calc(100vh-64px)] sm:h-[calc(100vh-112px)]
          -m-4 sm:-m-12
          bg-cover bg-no-repeat bg-center
          top-0 bottom-0 left-0 -right-[88px] sm:right-0'
      >
        <div className='p-12 h-full'>
          <h1 className='w-fit rounded-md font-serif font-semibold text-4xl mb-6 bg-white/20 backdrop-blur-md p-6'>Our adventures on the Atlantic Ocean</h1>
          <div className=' w-full flex gap-6'>
            <div className='grow-[2] bg-black/5 backdrop-blur-md text-yellowAccent-300 rounded p-4 opacity-0'>
              Google Map
            </div>
            <div className='bg-white/10 flex backdrop-blur-lg rounded-lg p-10'>
              <BlogPostTile blogPost={ mostRecentBlog } index={0} />
            </div>
          </div>
        </div>

      </div>

      <div className="h-96 md:h-[560px] bg-white -mx-4 sm:-mx-12 py-4 sm:p-12 sm:py-24 ">
        <h2 className='font-serif text-5xl mb-8'>Life aboard a Ted Hood Classic</h2>
        <div className="flex gap-6 w-full h-full">
          <div className='max-w-[40%] text-2xl font-sans'>
            Purchased in 2007, weve modified our vessel over the last 16 years, and have been cruising Maine and the Bahamas since 2014.
            <br />
            <br />
            Read more about our vessel, and how weve upgraded it
          </div>
          <div className='grow-1 w-full bg-gray-500 text-yellowAccent-200'>Picture of boat architecture</div>
        </div>
      </div>
    </>
  );
}
