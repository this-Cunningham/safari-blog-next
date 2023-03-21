import './globals.css';

import { Cinzel_Decorative, Montserrat } from 'next/font/google';
import Link from 'next/link';

import { Navbar } from 'src/components/Navbar';
import { SafariWireLogo } from 'src/components/supplemental/SafariWireLogo';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600'],
  subsets: ['latin'],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: '--font-cinzel-decorative',
  display: 'swap',
  weight: ['400', '700', '900'],
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
    <html lang="en" className={ `${montserrat.variable} ${cinzelDecorative.variable}` }>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className='tracking-[.02em] text-base bg-yellowAccent-50 text-black mt-16 sm:mt-28'>
        <main className='max-w-[1440px] mx-auto'>
          {children}
        </main>
        {/* @ts-expect-error Server Component */}
        <Navbar />

        <footer className='bg-skyPrimary-50 p-5 md:px-0 mt-8 sm:mt-20'>
          <div className='min-h-[280px] p-8 mx-auto max-w-[1440px] flex flex-col gap-6 md:flex-row justify-between items-center'>
            <div>
              <SafariWireLogo
                width={ 130 } height={ 163 }
                className='rounded w-full h-auto'
              />
            </div>

            <Link href='/'
              className='font-serif text-3xl md:text-6xl lg:text-8xl text-gray-500 hover:underline'>
                SAFARI
            </Link>

            <div className='text-black font-serif text-base lg:text-xl text-center md:text-right space-y-1'>
              <Link
                href='https://www.wscunningham.com/design'
                target='_blank'
                className='hover:underline'
              >
                Designed by Willie Cunningham
              </Link>
              <div>Developed by Chris Cunningham</div>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}