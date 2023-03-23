import Image from 'next/image';

interface SafariWireLogProps {
  height: number;
  width: number;
  className: string;
}
// still need to supply height and width in CSS/TW...height/width props are for nextJS
export const SafariWireLogo = ({ height, width, className }: SafariWireLogProps) => (
  <Image src='/safari-wire.png'
    width={ width } height={ height }
    alt='wire frame of sailboat'
    className={ `brightness-50 contrast-150 ${className}` }
  />
);