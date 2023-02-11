import {createClient} from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const SANITY_projectId = process.env.SANITY_PROJECT_ID;
export const SANITY_dataset = process.env.SANITY_DATASET;
export const SANITY_apiVersion = process.env.SANITY_API_VERSION;
export const SANITY_token = process.env.SANITY_ADMIN_API_TOKEN;

// for help with env variables when deploying -- https://www.sanity.io/guides/nextjs-live-preview#:~:text=Note%3A%20You%E2%80%99ll%20need%20to%20recreate%20these%20environment%20variables%20when%20deploying%20the%20site%20to%20your%20hosting.

export const client = createClient({
  projectId: SANITY_projectId,
  dataset: SANITY_dataset,
  apiVersion: '2023-02-10',
  token: process.env.SANITY_ADMIN_API_TOKEN,
  useCdn: true
});

// client.delete({ query: '*[_type == "nav_bar_section"]'}).then(result => console.log('chiclen', result))

const builder = imageUrlBuilder({
  projectId: SANITY_projectId!,
  dataset: SANITY_dataset!,
});

export const urlFor = (source: any) => builder.image(source).url();