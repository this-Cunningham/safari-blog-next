import { BlurredMapLink } from './BlurredMapLink';
import { SupplementalInfoPanel } from './SupplementalInfoPanel';

export const FollowUsMapPanel = () => (
  <SupplementalInfoPanel>
    <div className='flex justify-between gap-10'>
      <h3 className='w-2/5 text-xl text-center md:text-left md:text-4xl lg:text-5xl lg:leading-[64px] lg:text-center self-center h-full'>Follow us wherever we go</h3>
      <BlurredMapLink />
    </div>
  </SupplementalInfoPanel>
);