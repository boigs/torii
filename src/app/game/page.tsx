'use client';

import React, { useCallback, useContext, useEffect } from 'react';

import { Center, Flex } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { useRouter } from 'next/navigation';

import AdminLobby, { AdminLobbyValues } from 'src/components/AdminLobby';
import { Context } from 'src/components/ContextProvider';
import WaitingLobby from 'src/components/WaitingLobby';
import logger from 'src/logger';
import { newStartGameMessage } from 'src/websocket/out';

import styles from './page.module.scss';

const Game: React.FC = () => {
  const router = useRouter();
  const { gameFsm, sendWebsocketMessage } = useContext(Context);
  const [state, send] = useActor(gameFsm);

  useEffect(() => {
    if (state.matches('disconnected')) {
      router.replace('/');
    } else if (!state.context.gameJoined) {
      send('GAME_JOINED');
    }
  }, [state, send, router]);

  const onGameStart = useCallback(
    (values: AdminLobbyValues) => {
      logger.debug({}, 'sending start message');
      sendWebsocketMessage(newStartGameMessage(values));
    },
    [sendWebsocketMessage]
  );

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
