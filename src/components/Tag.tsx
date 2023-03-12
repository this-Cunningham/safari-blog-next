import Link from 'next/link';
import { TagInterface } from 'src/app/interfaces_blog';

export const Tag = ({ tag }: { tag: TagInterface }) => (
  <Link href={ `/tag/${tag.slug}` } className='inline-flex underline text-sm m-1'>
    { tag.tagName }
  </Link>
);