'use client';

import { useEffect } from 'react';

import { Center, Text, VStack } from '@chakra-ui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import EndOfRound from 'src/components/Game/EndOfRound';
import HostLobby, {
  HostLobbyValues,
} from 'src/components/Game/Lobby/HostLobby';
import Lobby from 'src/components/Game/Lobby/NonHostLobby';
import VotingCard from 'src/components/Game/Voting/VotingCard';
import VotingItems from 'src/components/Game/Voting/VotingItems';
import VotingSummary from 'src/components/Game/Voting/VotingSummary';
import WordsInput from 'src/components/Game/Words/WordsInput';
import { useGameContext } from 'src/components/GameContextProvider';
import AnimatedParent from 'src/components/Shared/AnimatedParent';
import Chat from 'src/components/Shared/Chat';
import JoinedPlayersList from 'src/components/Shared/JoinedPlayersList';
import LoadingCard from 'src/components/Shared/LoadingCard';
import { WordScoresCard } from 'src/components/Shared/WordScores';
import HeadcrabState from 'src/domain/headcrabState';
import Word from 'src/domain/word';
import { artificialSleep } from 'src/helpers/sleep';
import {
  acceptPlayersVotingWords,
  continueToNextRound,
  playerVotingWord,
  playerWords,
  startGame,
} from 'src/websocket/out';

import styles from './page.module.scss';

const Game = () => {
  const router = useRouter();
  const { gameActor, game, sendWebsocketMessage, isInsideOfGame } =
    useGameContext();
  const [state, send] = [gameActor.getSnapshot(), gameActor.send];

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
          {game.state === HeadcrabState.Lobby && (
            <>
              {game.player.isHost ? (
                <HostLobby onSubmit={sendGameStart} className={styles.lobby} />
              ) : (
                <Lobby className={styles.lobby} />
              )}
            </>
          )}
          {game.state === HeadcrabState.PlayersSubmittingWords && (
            <WordsInput
              player={game.player}
              round={game.lastRound()}
              onSubmit={sendPlayerWords}
              className={classNames(
                styles.wordsInput,
                styles.wordsInputPlaying,
              )}
            />
          )}
          {game.state === HeadcrabState.PlayersSubmittingVotingWord && (
            // TODO remove this VStack container
            <VStack spacing='24px'>
              <VotingItems
                player={game.player}
                round={game.lastRound()}
                className={classNames(styles.width100)} // TODO remove this style
              />
              <VotingCard
                player={game.player}
                round={game.lastRound()}
                onWordClicked={sendPlayerVotingWord}
                className={classNames(styles.width100)} // TODO remove this style
              />
              <VotingSummary
                player={game.player}
                players={game.players}
                round={game.lastRound()}
                onAcceptButtonClicked={sendAcceptPlayersVotingWords}
                className={classNames(styles.width100)} // TODO remove this style
              />
              <WordScoresCard
                player={game.player}
                round={game.lastRound()}
                className={classNames(styles.width100)} // TODO remove this style
              />
            </VStack>
          )}
          {game.state === HeadcrabState.EndOfRound && (
            <VStack spacing='24px'>
              <EndOfRound
                player={game.player}
                isLastRound={game.isLastRound()}
                onContinueClicked={sendContinueToNextRound}
                className={classNames(styles.width100)} // TODO remove this style
              />
            </VStack>
          )}
          {game.state === HeadcrabState.EndOfGame ? (
            <Text>End of game</Text>
          ) : null}
          <JoinedPlayersList
            gameId={state.context.gameId}
            players={game.players}
            hideJoinUrl={game.state !== HeadcrabState.Lobby}
            className={classNames(
              [styles.joinedPlayersList],
              game.state === HeadcrabState.PlayersSubmittingWords
                ? styles.joinedPlayersListPlaying
                : null,
            )}
          />
          <Chat
            className={classNames(
              [styles.chat],
              game.state === HeadcrabState.PlayersSubmittingWords
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
