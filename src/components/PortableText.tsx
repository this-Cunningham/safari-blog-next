import { BlockContentImg } from 'src/app/interfaces_blog';
import { ImageWrapper } from './ImgWrapper';

export const BlogImageBlockContent = ({ value }: { value: BlockContentImg }) => (
  <ImageWrapper src={ value.image.asset.url} alt="" />
);

export const ImageCollectionBlockContent = ({ value }: { value: { collectionImages: BlockContentImg[]} }) => (
  <div style={{ display: 'flex', gap: '8px', height: '320px', overflow: 'scroll hidden', padding: '12px 0' }}>
    { value.collectionImages?.map((image) => (
      <ImageWrapper src={ image.image.asset.url } alt="" key={ image.image.asset.url }
        style={{ height: '100%', maxWidth: 'fit-content' }}
      />
    ))}
  </div>
);