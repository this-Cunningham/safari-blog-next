import Link from 'next/link';
import { client } from 'src/lib/sanity.client';
import { Author } from '../interfaces_blog';

import styles from './authors.module.css';

export default async function AboutUs () {
  const authors: Author[] = await client.fetch(`*[_type == "author"]{
      name,
      slug{ current },
      bio,
      authorImage{ asset->{path, url} }
    }`);

  return (
    <div className={ styles['about-us-container']}>
      <div>ABOUT US</div>
      <div className={ styles['authors-container']}>
        { authors.map(author => (
          <div className='author-container' key={ author.slug.current }>
            <h4>{ author.name }</h4>
            <img src={ author.authorImage.asset.url } alt={ author.name } />
            <p>{ author.bio }</p>
            <Link href={ `photos/by/${author.slug.current}` }>
              Photos by { author.name.split(' ')[0] }
            </Link>
          </div>
        )) }
      </div>
    </div>
  );
}