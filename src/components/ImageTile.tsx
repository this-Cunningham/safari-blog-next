import Link from 'next/link';
import { MainImage } from 'src/app/interfaces_blog';
import styles from './ImageTile.module.css';

export const ImageTile = ({ photo }: { photo: MainImage }) => (
  <Link href={ `photos/${photo._id}` }>
    <img
      className={ styles.imageTile }
      src={photo.image.asset.url}
      alt={ photo.caption }
    />
  </Link>
);