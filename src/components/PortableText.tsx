import { BlockContentImg } from 'src/app/interfaces_blog';

export const BlogImageBlockContent = ({ value }: { value: BlockContentImg }) => (
  <img src={ value.image.asset.url} alt="" />
);

export const ImageCollectionBlockContent = ({ value }: { value: { collectionImages: BlockContentImg[]} }) => (
  <div style={{ display: 'flex', gap: '8px', height: '320px', overflow: 'scroll hidden' }}>
    { value.collectionImages?.map((image) => (
      <img src={ image.image.asset.url } alt="" key={ image.image.asset.url }
        style={{ height: '100%', width: 'auto' }}
      />
    ))}
  </div>
);