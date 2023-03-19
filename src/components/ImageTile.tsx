import Image from 'next/image';
import Link from 'next/link';
import { BlogImage } from 'src/app/interfaces_blog';
import { urlFor } from 'src/lib/imageUrlBuilder';

const ImageTile = ({ photo, priority }: { photo: BlogImage; priority: boolean }) => (
  <Link href={ `/photos/${photo._id}` }
    className='flex grow w-60 h-auto rounded ease-out transition-all duration-[250ms]
      hover:scale-[1.02] hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]'
  >
    <Image
      className='rounded w-full h-auto'
      src={ urlFor(photo.image).height(300).width(300*1.77).quality(100).url() }
      height={ 300 }
      width={ 300*1.77 }
      placeholder='blur'
      blurDataURL={ photo.image.asset.metadata.lqip }
      priority={ priority }
      alt={ photo.caption ?? 'small image on a tile' }
    />
  </Link>
);

export const ImageTileList = ({ photos }: { photos: BlogImage[] }) => (
  <div className='flex flex-wrap gap-2 after:w-60 after:flex-grow'>
    { photos.map((photo, index) => (
      <ImageTile photo={ photo } priority={ index < 6 } key={ photo._id } />
    ))}
  </div>
);