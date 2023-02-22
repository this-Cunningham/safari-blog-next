
export const groq_MODULE_BLOG_CONTENT_BLOCKS = `//groq
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
`;