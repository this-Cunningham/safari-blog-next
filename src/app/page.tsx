import { BlogPostList } from '../components/BlogPostList';

export default async function Home() {
  return (
    <>
        {/* @ts-expect-error Server Component */}
        <BlogPostList />
    </>
  );
}
