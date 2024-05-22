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
import theme from './theme';

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

const root = document.getElementById('root');

if (root === null) {
  throw new Error('root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <GameContextProvider>
        <AnimatedParent>
          <RouterProvider router={router} />
        </AnimatedParent>
      </GameContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
