import Image from 'next/image';
import Link from 'next/link';

export const BlurredMapLink = () => (
  <Link href='/adventures'
    className='w-1/2 relative after:rounded after:absolute after:top-0 after:left-0 after:h-full after:w-full after:bg-black/25 after:backdrop-blur-[5px]'>

    <Image src='/blurred-map-img.png' width={ 500 } height={ 300 }
      alt='blurry-map'
      className='rounded w-full h-auto'
      placeholder='blur'
      blurDataURL='/blurred-map-img.png'
    />

    <h3 className='absolute flex justify-center items-center text-center h-full p-2 top-0 left-0 w-full z-10 font-serif font-bold text-white text-lg sm:text-2xl'>
      Click to find us
    </h3>
  </Link>
);