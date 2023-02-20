import { definePreview } from 'next-sanity/preview';
import { SANITY_projectId, SANITY_dataset } from './sanity.client';

function onPublicAccessOnly() {
  throw new Error('Unable to load preview as you\'re not logged in');
}
export const usePreview = definePreview({
  projectId: SANITY_projectId!,
  dataset: SANITY_dataset!,
  onPublicAccessOnly
});