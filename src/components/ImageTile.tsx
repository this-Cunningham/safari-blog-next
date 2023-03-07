import Image from 'next/image';
import Link from 'next/link';
import { BlogImage } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';
import styles from './ImageTile.module.css';

export const ImageTile = ({ photo }: { photo: BlogImage }) => (
  <Link href={ `/photos/${photo._id}` }>
    <Image
      className={ styles.imageTile }
      src={ urlFor(photo.image).height(300).width(300*1.77).quality(100).url() }
      height={ 300 }
      width={ 300*1.77 }
      alt={ photo.caption }
    />
  </Link>
);