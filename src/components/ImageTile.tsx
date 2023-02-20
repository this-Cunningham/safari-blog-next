import { MainImage } from 'src/app/interfaces_blog';
import styles from './ImageTile.module.css';

export const ImageTile = ({ photo }: { photo: MainImage }) => (
  <img className={ styles.ImageTile }
    src={photo.image.asset.url}
    alt={ photo.caption }
  />
);