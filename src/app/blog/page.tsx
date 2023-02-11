import { BlogPostList } from '../../components/BlogPostList';

export default async function SiteSection() {
  return (
    <div>
      { await BlogPostList()
      // eventually should call this like <BlogPostList /> but typescript + nextjs + react still working on it {/* @ts-expect-error Server Component */}
      }
    </div>
  );
}