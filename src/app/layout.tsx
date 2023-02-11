import './globals.css';
import { Navbar } from './Navbar';
import { Montserrat } from '@next/font/google';
import SideBar from 'src/components/SideBar';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '500']
});

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
          {/* @ts-expect-error Server Component */}
          <Navbar />
          <main className='contentWrapper'>
            {children}
            <SideBar />
          </main>
      </body>
    </html>
  );
}