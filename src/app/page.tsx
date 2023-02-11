import styles from './page.module.css';
import { BlogPostList } from './BlogPostList';

export default async function Home() {
  return (
    <>
      <div className={ styles.blogBody }>
        {/* @ts-expect-error Server Component */}
        <BlogPostList />
      </div>
    </>
  );
}
