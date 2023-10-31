'use client';

import React, { useContext, useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useActor, useSelector } from '@xstate/react';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import WaitingLobby from 'src/components/WaitingLobby';

const Game: React.FC = () => {
  const router = useRouter();
  const { gameFsm } = useContext(Context);
  const [state] = useActor(gameFsm);

  useEffect(() => {
    if (state.matches('disconnected')) {
      router.replace('/');
    }
  }, [state, router]);

  return (
    <Center>
      <WaitingLobby
        gameId={state.context.gameId}
        players={state.context.players}
      />
    </Center>
  );
};

export default Game;
