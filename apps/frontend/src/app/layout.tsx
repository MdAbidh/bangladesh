import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/providers';
import '@mantine/core/styles.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'A.H Learning App',
  description:
    'A comprehensive learning management platform offering courses, interactive lessons, and certification programs.',
  keywords: ['learning', 'education', 'courses', 'online learning', 'A.H Learning'],
  authors: [{ name: 'A.H Learning' }],
  openGraph: {
    title: 'A.H Learning App',
    description:
      'A comprehensive learning management platform offering courses, interactive lessons, and certification programs.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </Providers>
      </body>
    </html>
  );
}
