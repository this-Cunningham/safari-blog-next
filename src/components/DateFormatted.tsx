import { ComponentPropsWithoutRef } from 'react';

interface DateFormatProps extends ComponentPropsWithoutRef<'div'> {
  dateString: string;
}
export const DateFormatter = ({ dateString, ...props }: DateFormatProps) => {
  const objectDate = new Date(dateString);

  const day = objectDate.getDate();

  const month = objectDate.getMonth();

  const year = objectDate.getFullYear().toString().slice(-2);

  const fullDate = `${month}/${day}/${year}`;

  return (
    <div { ...props }>{ fullDate }</div>
  );
};