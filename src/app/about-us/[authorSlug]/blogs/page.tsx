export default function BlogsByAuthor ({ params }: { params: { authorSlug: string }}) {
  return <div>blogs by { params.authorSlug }</div>;
}