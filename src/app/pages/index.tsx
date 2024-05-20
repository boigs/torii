import React from 'react';

import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Providers } from 'src/app/providers';
import { GameContextProvider } from 'src/components/context/GameContextProvider';
import AnimatedParent from 'src/components/shared/AnimatedParent';

import Create from './Create';
import Game from './Game';
import Join from './Join';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Create />,
  },
  {
    path: 'join/:gameId?',
    element: <Join />,
  },
  {
    path: 'game',
    element: <Game />,
  },
]);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <GameContextProvider>
        <AnimatedParent>
          <RouterProvider router={router} />
        </AnimatedParent>
      </GameContextProvider>
    </Providers>
  </React.StrictMode>,
);
