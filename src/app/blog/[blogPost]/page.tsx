export default async function SiteSection({ params }: { params: { blogPost: string }}) {
  const { blogPost } = params;
  return (
    <div>
      This is a blogpost for: { blogPost }
    </div>
  );
}