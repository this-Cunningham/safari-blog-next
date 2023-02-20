import Link from 'next/link';
import { client } from 'src/lib/sanity.client';
import { Author } from '../interfaces_blog';

import styles from './authors.module.css';

const AuthorPanel = ({ author }: { author: Author }) => (
  <div className={ styles['author-wrapper'] } key={ author.slug.current }>

    <div className={ styles['author-avatar'] }>
      <h4>{ author.name }</h4>
      <img src={ author.authorImage.asset.url } alt={ author.name } />
    </div>

    <div className={ styles['author-info'] }>
      <p>{ author.bio }</p>

      <Link href={ `photos/by/${author.slug.current}` }>
        Photos by { author.name.split(' ')[0] }
      </Link>

      <br />

      <Link href={ `blog/by/${author.slug.current}`}>
        Blogs by { author.name.split(' ')[0] }
      </Link>
    </div>

  </div>
);

export default async function AboutUs () {
  const authors: Author[] = await client.fetch(`*[_type == "author"]{
      name,
      slug{ current },
      bio,
      authorImage{ asset->{path, url} }
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