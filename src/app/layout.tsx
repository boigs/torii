import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Boigs',
  description: 'no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={inter.className}
        style={{ backgroundColor: 'rgb(175, 215, 215)', padding: 24 }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
