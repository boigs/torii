import classNames from 'classnames';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import ContextProvider from 'src/components/ContextProvider';

import { Providers } from './providers';

import styles from './layout.module.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Repeti2',
  description: 'Play the game of being as unoriginal as possible',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='icon'
          href='/favicon.ico?v=2'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#bee3f8' />
        <meta name='msapplication-TileColor' content='#bee3f8' />
        <meta name='theme-color' content='#bee3f8' />
      </head>
      <body className={classNames(inter.className, styles.root)}>
        <Providers>
          <ContextProvider>{children}</ContextProvider>
        </Providers>
      </body>
    </html>
  );
}
