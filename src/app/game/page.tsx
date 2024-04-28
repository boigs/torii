'use client';

import { useContext, useEffect } from 'react';

import { Center, VStack } from '@chakra-ui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import AnimatedParent from 'src/components/AnimatedParent';
import Chat from 'src/components/Chat';
import { Context } from 'src/components/ContextProvider';
import HostLobby, { HostLobbyValues } from 'src/components/HostLobby';
import JoinedPlayersList from 'src/components/JoinedPlayersList';
import LoadingCard from 'src/components/LoadingCard';
import Lobby from 'src/components/Lobby';
import Scoring from 'src/components/Scoring';
import VotingCard from 'src/components/VotingCard';
import VotingSummary from 'src/components/VotingSummary';
import WordsInput from 'src/components/WordsInput';
import { Word } from 'src/domain';
import { artificialSleep } from 'src/helpers/sleep';
import logger from 'src/logger';
import {
  chatMessage,
  playerWordsMessage,
  startGameMessage,
  submitPlayerWordForScoringMessage,
} from 'src/websocket/out';

import styles from './page.module.scss';

const Game = () => {
  const router = useRouter();
  const { gameActor, sendWebsocketMessage, player, isInsideOfGame } =
    useContext(Context);
  const [state, send] = [gameActor.getSnapshot(), gameActor.send];

  useEffect(() => {
    if (state.matches('disconnected')) {
      router.replace('/join');
    }
    if (isInsideOfGame && !state.context.gameJoined) {
      send({ type: 'GAME_JOINED' });
    }
  }, [state, send, router, isInsideOfGame]);

  const sendGameStartMessage = (values: HostLobbyValues) => {
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

  const sendWordForVoting = (word: Word | null) => {
    sendWebsocketMessage(submitPlayerWordForScoringMessage(word?.word ?? null));
  };

  return (
    <Center>
      {state.matches('disconnected') ? (
        <LoadingCard />
      ) : (
        <AnimatedParent className={styles.gameContainerGrid}>
          {state.matches('lobby') && (
            <>
              {player?.isHost ? (
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
              className={classNames(
                styles.wordsInput,
                state.matches('playersWritingWords')
                  ? styles.wordsInputPlaying
                  : null
              )}
              player={player!}
              // as players submit their words, the round is updated
              round={state.context.rounds.at(-1)!}
              onSubmit={sendWordsMessage}
            />
          )}
          {state.matches('playersSendingWordSubmission') && (
            // TODO remove this VStack container
            <VStack spacing='24px'>
              <Scoring
                className={classNames(styles.width100)} // TODO remove this style
                round={state.context.rounds.at(-1)!}
                you={player!}
                players={state.context.players}
              />
              <VotingCard
                className={classNames(styles.width100)} // TODO remove this style
                round={state.context.rounds.at(-1)!}
                player={player!}
                onWordClicked={sendWordForVoting}
              />
              <VotingSummary
                className={classNames(styles.width100)} // TODO remove this style
                round={state.context.rounds.at(-1)!}
                you={player!}
                players={state.context.players}
              />
            </VStack>
          )}
          <JoinedPlayersList
            className={classNames(
              [styles.joinedPlayersList],
              state.matches('playersWritingWords')
                ? styles.joinedPlayersListPlaying
                : null
            )}
            gameId={state.context.gameId}
            players={state.context.players}
          />
          <Chat
            className={classNames(
              [styles.chat],
              state.matches('playersWritingWords') ? styles.chatPlaying : null
            )}
            onSubmit={sendChatMessage}
            messages={state.context.messages}
            players={state.context.players}
          />
        </AnimatedParent>
      )}
    </Center>
  );
};

export default Game;
