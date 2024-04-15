'use client';

import React, { useContext, useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { useRouter } from 'next/navigation';

import AnimatedParent from 'src/components/AnimatedParent';
import Chat from 'src/components/Chat';
import { Context } from 'src/components/ContextProvider';
import HostLobby, { HostLobbyValues } from 'src/components/HostLobby';
import JoinedPlayersList from 'src/components/JoinedPlayersList';
import LoadingCard from 'src/components/LoadingCard';
import Lobby from 'src/components/Lobby';
import WordsInput from 'src/components/WordsInput';
import { artificialSleep } from 'src/helpers/sleep';
import logger from 'src/logger';
import {
  chatMessage,
  playerWordsMessage,
  startGameMessage,
} from 'src/websocket/out';

import styles from './page.module.scss';

const Game: React.FC = () => {
  const router = useRouter();
  const { gameFsm, sendWebsocketMessage } = useContext(Context);
  const [state, send] = useActor(gameFsm);

  useEffect(() => {
    if (state.matches('disconnected')) {
      router.replace('/join');
    }
    if (state.matches('lobby') && !state.context.gameJoined) {
      send({ type: 'GAME_JOINED' });
    }
  }, [state, send, router]);

  const sendGameStartMessage = async (values: HostLobbyValues) => {
    logger.debug({ values }, 'sending start message');
    sendWebsocketMessage(startGameMessage(values));
  };

  const sendChatMessage = async (text: string) => {
    await artificialSleep(100);
    sendWebsocketMessage(chatMessage(text));
  };

  const sendWordsMessage = async (words: string[]) => {
    logger.debug({ words }, 'sending player words');
    sendWebsocketMessage(playerWordsMessage(words));
    await artificialSleep(350);
  };

  return (
    <Center>
      {state.matches('disconnected') ? (
        <LoadingCard />
      ) : (
        <>
          <AnimatedParent className={styles.gameContainerGrid}>
            {state.matches('lobby') && (
              <>
                {state.context.players.find(
                  ({ nickname }) => state.context.nickname === nickname
                )?.isHost ? (
                  <HostLobby
                    className={styles.lobby}
                    onSubmit={sendGameStartMessage}
                  />
                ) : (
                  <Lobby className={styles.lobby} />
                )}
              </>
            )}
            {state.matches('playersWritingWords') && (
              <WordsInput
                className={styles.wordsInput}
                word={state.context.rounds.at(-1)?.word as string}
                onSubmit={sendWordsMessage}
              />
            )}
            {state.matches('playersSendingWordSubmission') && <>TODO</>}
            <JoinedPlayersList
              className={styles.joinedPlayersList}
              gameId={state.context.gameId}
              players={state.context.players}
            />
            <Chat
              className={styles.chat}
              onSubmit={sendChatMessage}
              messages={state.context.messages}
              players={state.context.players}
            />
          </AnimatedParent>
        </>
      )}
    </Center>
  );
};

export default Game;
