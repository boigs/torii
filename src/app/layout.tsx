import React from 'react';

import classNames from 'classnames';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './providers';

import styles from './layout.module.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Repeti2',
  description: 'no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={classNames(inter.className, styles.root)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
