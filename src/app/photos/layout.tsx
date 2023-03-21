import { SupplementalInfoPanel } from 'src/components/SupplementalInfoPanel';
import { BlurredMapLink } from 'src/components/BlurredMapLink';

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='p-4 sm:p-12'>
        { children }
      </div>
      <SupplementalInfoPanel>
        <div className="flex gap-10 text-center">
          <h3 className='w-1/2 text-5xl self-center h-full'>Follow us wherever we go</h3>
          <BlurredMapLink />
        </div>
      </SupplementalInfoPanel>
    </>
  );
}
