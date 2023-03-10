import Link from 'next/link';
import { BlogPostBlockContent } from 'src/components/BlogPostBlockContent';
import { ImageWrapper } from 'src/components/ImgWrapper';
import { client } from 'src/lib/sanity.client';
import { Author } from '../interfaces_blog';

import styles from './Authors.module.css';

const AuthorPanel = ({ author }: { author: Author }) => (
  <div className={ styles['author-wrapper'] } key={ author.slug.current }>

    <div className={ styles['author-avatar'] }>
      <h4>{ author.name }</h4>
      <ImageWrapper src={ author.authorImage.asset.url } alt={ author.name } />
    </div>

    <div className={ styles['author-info'] }>
      <BlogPostBlockContent value={ author.bio } />

      <Link href={ `/about-us/${author.slug.current}/photos` }>
        Photos by { author.name.split(' ')[0] }
      </Link>

      <br />

      <Link href={ `/about-us/${author.slug.current}/blogs`}>
        Blogs by { author.name.split(' ')[0] }
      </Link>
    </div>

  </div>
);

export default async function AboutUs () {
  const authors: Author[] = await client.fetch(`*[_type == "author"]{
      name,
      slug{ current },
      bio[]{
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
      },
      authorImage{ ..., asset->{path, url} }
    }`);

  return (
    <div className={ styles['about-us-container'] }>
      <div>ABOUT US</div>
      <div className={ styles['authors-container'] }>
        { authors.map(author => (
          <AuthorPanel author={ author } key={ author.slug.current } />
        )) }
      </div>
    </div>
  );
}