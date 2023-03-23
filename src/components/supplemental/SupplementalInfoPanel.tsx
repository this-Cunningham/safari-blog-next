export const SupplementalInfoPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='max-w-7xl font-serif w-full mx-auto p-4 sm:p-12 bg-skyPrimary-200 sm:mt-6 rounded'>
      { children }
    </div>
  );
};