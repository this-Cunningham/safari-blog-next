import Image from 'next/image';
import Link from 'next/link';
import { BlogImage } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';
import styles from './ImageTile.module.css';

const ImageTile = ({ photo, priority }: { photo: BlogImage; priority: boolean }) => (
  <Link href={ `/photos/${photo._id}` } className={ styles.imageTile }>
    <Image
      src={ urlFor(photo.image).height(300).width(300*1.77).quality(100).url() }
      height={ 300 }
      width={ 300*1.77 }
      priority={ priority }
      alt={ photo.caption }
    />
  </Link>
);

export const ImageTileList = ({ photos }: { photos: BlogImage[] }) => (
  <div className={ styles.imageTileList}>
    { photos.map((photo, index) => (
      <ImageTile photo={ photo } priority={ index < 6 } key={ photo._id } />
    ))}
  </div>
);