import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  Playfair_Display,
} from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const playfairDisplayHeading = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
});

const notoSans = Noto_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans' 
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PartWorks',
  description: 'Platform Lowongan Kerja Part-Time',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'min-h-full flex flex-col antialiased',
          notoSans.variable, 
          playfairDisplayHeading.variable,
          geistSans.variable,
          geistMono.variable,
          'font-sans' 
        )}
      >
        {children}
      </body>
    </html>
  );
}