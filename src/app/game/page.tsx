'use client';

import { useContext, useEffect } from 'react';

import { Center, Text, VStack } from '@chakra-ui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import EndOfRound from 'src/components/Game/EndOfRound';
import HostLobby, {
  HostLobbyValues,
} from 'src/components/Game/Lobby/HostLobby';
import Lobby from 'src/components/Game/Lobby/NonHostLobby';
import VotingCard from 'src/components/Game/Voting/VotingCard';
import VotingItems from 'src/components/Game/Voting/VotingItems';
import VotingSummary from 'src/components/Game/Voting/VotingSummary';
import WordsInput from 'src/components/Game/Words/WordsInput';
import AnimatedParent from 'src/components/Shared/AnimatedParent';
import Chat from 'src/components/Shared/Chat';
import JoinedPlayersList from 'src/components/Shared/JoinedPlayersList';
import LoadingCard from 'src/components/Shared/LoadingCard';
import { WordScoresCard } from 'src/components/Shared/WordScores';
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
  const player = state.context.game.player;

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
      playerVotingWord({ word: word === null ? null : word.value }),
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
              {player.isHost ? (
                <HostLobby onSubmit={sendGameStart} className={styles.lobby} />
              ) : (
                <Lobby className={styles.lobby} />
              )}
            </>
          )}
          {state.matches('playersSubmittingWords') && (
            <WordsInput
              player={player}
              round={state.context.game.lastRound()}
              onSubmit={sendPlayerWords}
              className={classNames(
                styles.wordsInput,
                styles.wordsInputPlaying,
              )}
            />
          )}
          {state.matches('playersSubmittingVotingWord') && (
            // TODO remove this VStack container
            <VStack spacing='24px'>
              <VotingItems
                player={player}
                round={state.context.game.lastRound()}
                className={classNames(styles.width100)} // TODO remove this style
              />
              <VotingCard
                player={player}
                round={state.context.game.lastRound()}
                onWordClicked={sendPlayerVotingWord}
                className={classNames(styles.width100)} // TODO remove this style
              />
              <VotingSummary
                player={player}
                players={state.context.game.players}
                round={state.context.game.lastRound()}
                onAcceptButtonClicked={sendAcceptPlayersVotingWords}
                className={classNames(styles.width100)} // TODO remove this style
              />
              <WordScoresCard
                player={player}
                round={state.context.game.lastRound()}
                className={classNames(styles.width100)} // TODO remove this style
              />
            </VStack>
          )}
          {state.matches('endOfRound') && (
            <VStack spacing='24px'>
              <EndOfRound
                player={player}
                isLastRound={state.context.game.isLastRound()}
                onContinueClicked={sendContinueToNextRound}
                className={classNames(styles.width100)} // TODO remove this style
              />
            </VStack>
          )}
          {state.matches('endOfGame') ? <Text>End of game</Text> : null}
          <JoinedPlayersList
            gameId={state.context.gameId}
            players={state.context.game.players}
            hideJoinUrl={!state.matches('lobby')}
            className={classNames(
              [styles.joinedPlayersList],
              state.matches('playersSubmittingWords')
                ? styles.joinedPlayersListPlaying
                : null,
            )}
          />
          <Chat
            messages={state.context.messages}
            onSubmit={sendChatMessage}
            className={classNames(
              [styles.chat],
              state.matches('playersSubmittingWords')
                ? styles.chatPlaying
                : null,
            )}
          />
        </AnimatedParent>
      )}
    </Center>
  );
};

export default Game;
