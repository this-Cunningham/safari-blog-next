import Image from 'next/image';
import Link from 'next/link';

export const BlurredMapLink = () => (
  <Link href='/adventures'
    className='relative after:rounded after:absolute after:top-0 after:left-0 after:h-full after:w-full after:bg-black/25 after:backdrop-blur-sm'>
    <Image
      src='/blurred-map-img.png' width={ 500 } height={ 300 }
      alt='blurry-map'
      className='rounded'
    />
  </Link>
);