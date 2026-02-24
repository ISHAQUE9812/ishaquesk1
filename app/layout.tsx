import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/components/Navbar';
import ScrollProgress from '@/app/components/ScrollProgress';
import FloatingShapes from '@/app/components/FloatingShapes';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Shaikh Mohammed Ishaque | Frontend Developer',
  description: 'Portfolio of Shaikh Mohammed Ishaque, a React.js & Next.js specialist creating cinematic web experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} bg-[#0f0f0f] text-gray-200 antialiased`}>
        <ScrollProgress />
        <Navbar />
        <FloatingShapes />
        <main>{children}</main>
      </body>
    </html>
  );
}