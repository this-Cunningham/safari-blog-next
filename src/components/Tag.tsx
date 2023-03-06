import Link from 'next/link';
import { TagInterface } from 'src/app/interfaces_blog';
import styles from './Tag.module.css';

export const Tag = ({ tag }: { tag: TagInterface }) => (
  <Link href={ `/tag/${tag.slug}` } className={styles['tag-link']}>
    { tag.tagName }
  </Link>
);