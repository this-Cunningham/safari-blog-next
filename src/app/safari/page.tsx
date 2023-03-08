import { BlogPostBlockContent } from 'src/components/BlogPostBlockContent';
import { client } from 'src/lib/sanity.client';

export default async function Safari () {
  const safariInfo: any[] = await client.fetch(`//groq
    *[_type == 'siteSection' && slug.current =='safari'][0].aboutSafari[]{
        _type == 'blogImageRef' => @->{
          caption,
          image{
            ...,
            asset->
          },
          tags[]->{"slug": slug.current, tagName},
        },
        _type == 'imageCollectionRef' => @->{
          _id,
          collectionName,
          collectionImages[]->{
            caption,
            image{
              ...,
              asset->
            },
            tags[]->{"slug": slug.current, tagName},
          },
        },
        _type != 'reference' => @,
      }

  `);

  if (safariInfo == null) {
    return <div>Page not found</div>;
  }
  return (
    <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
      <BlogPostBlockContent value={ safariInfo }/>
    </div>
  );
}