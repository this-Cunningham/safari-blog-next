export default function PhotosLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode,
}) {
  return (
    <div className='photos-layout'>
      {children}
    </div>
  );
}