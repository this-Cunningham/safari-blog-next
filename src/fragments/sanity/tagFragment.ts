// this is getting all tags (nested too) from a single blogpost and spreading the results into an array called "allTags", it also dives into mainImage and body to get all tags
export const groq_MODULE_ALL_TAGS_FROM_BLOGPOST = `//groq
  "allTags": array::compact([
    ...tags[]->{ "slug": slug.current, tagName },
    ...mainImage->.tags[]->{ "slug": slug.current, tagName },
    ...body[]{
      _type == 'imageCollectionRef' => @->
    }.collectionImages[]->.tags[]->{ "slug": slug.current, tagName }
  ])
`;