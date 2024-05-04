'use client';

import { useContext, useEffect } from 'react';

import { Center, Text, VStack } from '@chakra-ui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import AnimatedParent from 'src/components/AnimatedParent';
import Chat from 'src/components/Chat';
import { Context } from 'src/components/ContextProvider';
import EndOfRound from 'src/components/EndOfRound';
import HostLobby, { HostLobbyValues } from 'src/components/HostLobby';
import JoinedPlayersList from 'src/components/JoinedPlayersList';
import LoadingCard from 'src/components/LoadingCard';
import Lobby from 'src/components/Lobby';
import VotingCard from 'src/components/VotingCard';
import VotingItems from 'src/components/VotingItems';
import VotingSummary from 'src/components/VotingSummary';
import WordScores from 'src/components/WordScores';
import WordsInput from 'src/components/WordsInput';
import { Word } from 'src/domain';
import { artificialSleep } from 'src/helpers/sleep';
import {
  acceptPlayersVotingWords,
  chatMessage,
  continueToNextRound,
  playerVotingWord,
  playerWords,
  startGame,
} from 'src/websocket/out';

import styles from './page.module.scss';

const Game = () => {
  const router = useRouter();
  const { gameActor, sendWebsocketMessage, isInsideOfGame } =
    useContext(Context);
  const [state, send] = [gameActor.getSnapshot(), gameActor.send];
  const you = state.context.game.you;

  useEffect(() => {
    if (state.matches('disconnected')) {
      router.replace('/join');
    }
    if (isInsideOfGame && !state.context.gameJoined) {
      send({ type: 'GAME_JOINED' });
    }
  }, [state, send, router, isInsideOfGame]);

  const sendGameStart = (values: HostLobbyValues) => {
    sendWebsocketMessage(startGame({ amountOfRounds: values.amountOfRounds }));
  };

  const sendChatMessage = async (content: string) => {
    await artificialSleep(100);
    sendWebsocketMessage(chatMessage({ content }));
  };

  const sendPlayerWords = async (words: string[]) => {
    sendWebsocketMessage(playerWords({ words }));
    await artificialSleep(350);
  };

  const sendPlayerVotingWord = (word: Word | null) => {
    sendWebsocketMessage(
      playerVotingWord({ word: word === null ? null : word.value })
    );
  };

  const sendAcceptPlayersVotingWords = () => {
    sendWebsocketMessage(acceptPlayersVotingWords());
  };

  const sendContinueToNextRound = () => {
    sendWebsocketMessage(continueToNextRound());
  };

  return (
    <Center>
      {state.matches('disconnected') ? (
        <LoadingCard />
      ) : (
        <AnimatedParent className={styles.gameContainerGrid}>
          {state.matches('lobby') && (
            <>
              {you.isHost ? (
                <HostLobby className={styles.lobby} onSubmit={sendGameStart} />
              ) : (
                <Lobby className={styles.lobby} />
              )}
            </>
          )}
          {state.matches('playersSubmittingWords') && (
            <WordsInput
              className={classNames(
                styles.wordsInput,
                styles.wordsInputPlaying
              )}
              you={you}
              // as players submit their words, the round is updated
              round={state.context.game.lastRound()}
              onSubmit={sendPlayerWords}
            />
          )}
          {state.matches('playersSubmittingVotingWord') && (
            // TODO remove this VStack container
            <VStack spacing='24px'>
              <VotingItems
                className={classNames(styles.width100)} // TODO remove this style
                round={state.context.game.lastRound()}
                you={you}
              />
              <VotingCard
                className={classNames(styles.width100)} // TODO remove this style
                round={state.context.game.lastRound()}
                you={you}
                onWordClicked={sendPlayerVotingWord}
              />
              <VotingSummary
                className={classNames(styles.width100)} // TODO remove this style
                round={state.context.game.lastRound()}
                you={you}
                players={state.context.game.players}
                onAcceptButtonClicked={sendAcceptPlayersVotingWords}
              />
              <WordScores
                you={you}
                round={state.context.game.lastRound()}
                className={classNames(styles.width100)} // TODO remove this style
              />
            </VStack>
          )}
          {state.matches('endOfRound') && (
            <VStack spacing='24px'>
              <EndOfRound
                isLastRound={state.context.game.isLastRound()}
                you={you}
                onContinueClicked={sendContinueToNextRound}
                className={classNames(styles.width100)} // TODO remove this style
              />
            </VStack>
          )}
          {state.matches('endOfGame') ? <Text>End of game</Text> : null}
          <JoinedPlayersList
            className={classNames(
              [styles.joinedPlayersList],
              state.matches('playersSubmittingWords')
                ? styles.joinedPlayersListPlaying
                : null
            )}
            gameId={state.context.gameId}
            players={state.context.game.players}
          />
          <Chat
            className={classNames(
              [styles.chat],
              state.matches('playersSubmittingWords')
                ? styles.chatPlaying
                : null
            )}
            onSubmit={sendChatMessage}
            messages={state.context.messages}
          />
        </AnimatedParent>
      )}
    </Center>
  );
};

export default Game;
