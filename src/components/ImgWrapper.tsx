/* eslint-disable @next/next/no-img-element */
export const ImageWrapper = (props: React.ComponentPropsWithRef<'img'>) => (
  <img src={ props.src } alt={ props.alt } {...props} />
);
