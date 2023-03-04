import Link from 'next/link';
import { BlogImage } from 'src/app/interfaces_blog';
import styles from './ImageTile.module.css';
import { ImageWrapper } from './ImgWrapper';

export const ImageTile = ({ photo }: { photo: BlogImage }) => (
  <Link href={ `/photos/${photo._id}`} style={{ display: 'flex', alignItems: 'center'}} >
    <ImageWrapper
      className={ styles.imageTile }
      src={photo.image.asset.url}
      alt={ photo.caption }
    />
  </Link>
);