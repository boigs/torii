import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { GameContextProvider } from 'src/components/context/GameContextProvider';
import AnimatedParent from 'src/components/shared/AnimatedParent';

import NotFound from './404';
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
  {
    path: '*',
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <ChakraProvider>
      <GameContextProvider>
        <AnimatedParent>
          <RouterProvider router={router} />
        </AnimatedParent>
      </GameContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
