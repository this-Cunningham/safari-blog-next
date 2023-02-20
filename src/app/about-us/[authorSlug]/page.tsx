export default function AboutTheAuthor ({ params }: { params: { authorSlug: string }}) {
  return <div>Author Info { params.authorSlug }</div>;
}