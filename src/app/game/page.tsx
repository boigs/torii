'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Center, Flex } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { useRouter } from 'next/navigation';

import AdminLobby, { AdminLobbyValues } from 'src/components/AdminLobby';
import Chat from 'src/components/Chat';
import { Context } from 'src/components/ContextProvider';
import WaitingLobby from 'src/components/WaitingLobby';
import logger from 'src/logger';
import { newChatMessage, newStartGameMessage } from 'src/websocket/out';

import styles from './page.module.scss';

const Game: React.FC = () => {
  const router = useRouter();
  const { gameFsm, sendWebsocketMessage } = useContext(Context);
  const [state, send] = useActor(gameFsm);

  useEffect(() => {
    if (state.matches('disconnected')) {
      router.replace('/');
    }
    if (state.matches('lobby') && !state.context.gameJoined) {
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

  const sendChatMessage = async (text: string) => {
    sendWebsocketMessage(newChatMessage(text));
  };

  return (
    <Center>
      <Flex className={styles.gameContainer}>
        {state.context.players.find(
          ({ nickname }) => state.context.nickname === nickname
        )?.isHost ? (
          <AdminLobby className={styles.adminLobby} onSubmit={onGameStart} />
        ) : null}
        <WaitingLobby
          className={styles.waitingLobby}
          gameId={state.context.gameId}
          players={state.context.players}
        />
        <Chat
          className={styles.chat}
          onSubmit={sendChatMessage}
          messages={state.context.messages}
          players={state.context.players}
        />
      </Flex>
    </Center>
  );
};

export default Game;
