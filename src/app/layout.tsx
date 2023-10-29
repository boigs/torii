import classNames from 'classnames';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { GameContextProvider } from 'src/state/GameContext';
import GameFiniteStateMachineProvider from 'src/state/GameContext/gameState';

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
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#afd7d7' />
        <meta name='msapplication-TileColor' content='#afd7d7' />
        <meta name='theme-color' content='#afd7d7' />
      </head>
      <body className={classNames(inter.className, styles.root)}>
        <Providers>
          <GameFiniteStateMachineProvider>
            {children}
          </GameFiniteStateMachineProvider>
        </Providers>
      </body>
    </html>
  );
}
