export const SupplementalInfoPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='font-serif w-full p-4 sm:p-12 bg-white drop-shadow-md mt-6'>
      { children }
    </div>
  );
};