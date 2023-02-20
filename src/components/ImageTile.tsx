import Link from 'next/link';
import { BlogImage } from 'src/app/interfaces_blog';
import styles from './ImageTile.module.css';

export const ImageTile = ({ photo }: { photo: BlogImage }) => (
  <Link href={ `/photos/${photo._id}` }>
    <img
      className={ styles.imageTile }
      src={photo.image.asset.url}
      alt={ photo.caption }
    />
  </Link>
);