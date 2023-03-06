import { ComponentPropsWithoutRef } from 'react';

interface DateFormatProps extends ComponentPropsWithoutRef<'div'> {
  dateString: string;
}
export const DateFormatter = ({ dateString, ...props }: DateFormatProps) => {
  const objectDate = new Date(dateString);

  const formattedDateString = objectDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div { ...props }>{ formattedDateString }</div>
  );
};