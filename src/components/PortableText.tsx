import { BlockContentImg } from 'src/app/interfaces_blog';

export const BlogImageBlockContent = ({ value }: { value: BlockContentImg; isInline?: boolean }) => {
  return (
    <>
      <img src={ value.image.asset.url} alt="" style={{ width: '80%'}}/>
    </>
  );
};