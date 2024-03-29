export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <div className='p-4 sm:p-12'>
      { children }
    </div>
  );
}