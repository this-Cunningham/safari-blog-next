import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';

import styles from './BlogPostList.module.css';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET;

const createUrlQuery = (query: string) => encodeURIComponent(query);

async function getSanityData(): Promise<{ result: StandardBlogPost[] }> {
  const QUERY = createUrlQuery('*[_type == "standard_blog_post"]')
  const SANITY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${QUERY}`;

  const res = await fetch(SANITY_URL);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

interface StandardBlogPost {
  _type: 'standard_blog_post';
  image: StandardBlogImage;
  standard_blog_title: string;
  text_content: string;
}

interface StandardBlogImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  },
  image_caption: string;
}

const builder = imageUrlBuilder({
  projectId: SANITY_PROJECT_ID!,
  dataset: SANITY_DATASET!,
});

const urlFor = (source: StandardBlogImage) => builder.image(source).url();

export const BlogPostList = async () => {
  const { result: blogPostList } = await getSanityData();

  return (
    <>
      { blogPostList.map(blogPost => (
        <div key={ blogPost.standard_blog_title } className={styles.blogPost}>
          <h2>{ blogPost.standard_blog_title }</h2>
          <Image src={ urlFor(blogPost.image) } alt="" fill priority/>
          <p>{ blogPost.text_content }</p>
        </div>
      ))}
    </>
  );
}