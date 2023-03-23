import Icon from './IconifyClientWrapper';

export const BackArrow = ({ size, color }: { size: number; color: string }) => (
  <Icon icon="material-symbols:arrow-right-alt-rounded"
    width={ size }
    height={ size }
    color={ color }
    rotate={ 2 }
  />
);

export const ForwardArrow = ({ size, color }: { size: number; color: string }) => (
  <Icon icon="material-symbols:arrow-right-alt-rounded"
    width={ size }
    height={ size }
    color={ color } />
);

