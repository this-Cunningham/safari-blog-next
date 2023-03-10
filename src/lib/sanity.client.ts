import { createClient } from 'next-sanity';

export const SANITY_projectId = process.env.SANITY_PROJECT_ID;
export const SANITY_dataset = process.env.SANITY_DATASET;
export const SANITY_apiVersion = process.env.SANITY_API_VERSION;
export const SANITY_token = process.env.SANITY_ADMIN_API_TOKEN;

// this will not work if imported to a 'use client' component
// since client components cannot use the process.env variables defined above
export const client = createClient({
  projectId: SANITY_projectId,
  dataset: SANITY_dataset,
  apiVersion: '2023-02-10',
  token: process.env.SANITY_ADMIN_API_TOKEN,
  useCdn: true, // set to false for production for revalidation
});
