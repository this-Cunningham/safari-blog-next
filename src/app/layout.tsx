import './globals.css';
import { Nunito } from 'next/font/google';
import { Navbar } from './Navbar';

const nunito = Nunito({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
});

// revalidating at the root layout causes revalidation of entire app
export const revalidate = 120; // in seconds

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body
        className={ `tracking-[.02em] text-base bg-yellowAccent-50 text-black ${nunito.className}` }
      >
        <main className='appWrapper flex flex-col items-center max-w-[1440px] mt-16 mx-auto mb-0 px-4 pt-0 pb-12 min-[400px]:pt-0 min-[400px]:px-12 min-[400px]:pb-12 sm:mt-24'>
          <div className='w-full'>
            {children}
          </div>
        </main>
        {/* @ts-expect-error Server Component */}
        <Navbar />
      </body>
    </html>
  );
}