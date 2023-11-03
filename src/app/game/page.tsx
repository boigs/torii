'use client';

import React, { useCallback, useContext, useEffect } from 'react';

import { Center, Flex } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { useRouter } from 'next/navigation';
import { send } from 'xstate';

import AdminLobby, { AdminLobbyValues } from 'src/components/AdminLobby';
import { Context } from 'src/components/ContextProvider';
import WaitingLobby from 'src/components/WaitingLobby';
import logger from 'src/logger';

import styles from './page.module.scss';

const Game: React.FC = () => {
  const router = useRouter();
  const { gameFsm } = useContext(Context);
  const [state] = useActor(gameFsm);

  useEffect(() => {
    if (state.matches('disconnected')) {
      router.replace('/');
    }
  }, [state, router]);

  const onGameStart = useCallback((values: AdminLobbyValues) => {}, []);

  return (
    <Center>
      <Flex className={styles.gameContainer}>
        {state.context.players.find(
          ({ nickname }) => state.context.nickname === nickname
        )?.isHost ? (
          <AdminLobby onSubmit={onGameStart} />
        ) : null}
        <WaitingLobby
          gameId={state.context.gameId}
          players={state.context.players}
        />
      </Flex>
    </Center>
  );
};

export default Game;
