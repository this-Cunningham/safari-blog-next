export default function BlogsByAuthor ({ params }: { params: { blogAuthorSlug: string }}) {
  return (
    <div>Blogs By { params.blogAuthorSlug }</div>
  );
}