import { BlogPostList } from '../../components/BlogPostList';

export default async function SiteSection({ params }: { params: { siteSection: string }}) {
  const { siteSection } = params;
  return (
    <div>
      { siteSection === 'about-us' && (
        <div>about us</div>
      )}
      {
        siteSection == 'safari' && (
          <div>safari</div>
        )}
      { siteSection == 'blog' && (
        await BlogPostList()
        // eventually should call this like <BlogPostList /> but typescript + nextjs + react still working on it {/* @ts-expect-error Server Component */}
      )}
      { siteSection == 'photos' && (
        <div>photos</div>
      )}
      { siteSection == 'where-are-we' && (
        <div>where are we</div>
      )}
    </div>
  );
}