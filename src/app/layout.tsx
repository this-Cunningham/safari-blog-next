import './globals.css';
import { Montserrat } from '@next/font/google';
import SideBar from 'src/components/SideBar';
import { Navbar } from './Navbar';
import { NavAndSideBarProviders } from './Providers';

const montserrat = Montserrat({
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
      <body className={montserrat.className}>
        <NavAndSideBarProviders>
          <main className='contentWrapper'>
            <div className="main-content-container">
              {children}
            </div>
            <SideBar />
          </main>
          {/* @ts-expect-error Server Component */}
          <Navbar />
        </NavAndSideBarProviders>
      </body>
    </html>
  );
}