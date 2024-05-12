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
import GameState from 'src/domain/gameState';
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
  const { gameConnectionActor, game, sendWebsocketMessage, isInsideOfGame } =
    useGameContext();
  const [gameConnection] = [gameConnectionActor.getSnapshot()];

  useEffect(() => {
    if (gameConnection.matches('disconnected')) {
      router.replace('/join');
    }
    if (isInsideOfGame && !gameConnection.context.gameJoined) {
      gameConnectionActor.send({ type: 'GAME_JOINED' });
    }
  }, [gameConnection, router, isInsideOfGame, gameConnectionActor]);

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
      {gameConnection.matches('disconnected') ? (
        <LoadingCard />
      ) : (
        <AnimatedParent className={styles.gameContainerGrid}>
          {game.state === GameState.Lobby && (
            <>
              {game.player.isHost ? (
                <HostLobby onSubmit={sendGameStart} className={styles.lobby} />
              ) : (
                <Lobby className={styles.lobby} />
              )}
            </>
          )}
          {game.state === GameState.PlayersSubmittingWords && (
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
          {game.state === GameState.PlayersSubmittingVotingWord && (
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
          {game.state === GameState.EndOfRound && (
            <VStack spacing='24px'>
              <EndOfRound
                player={game.player}
                isLastRound={game.isLastRound()}
                onContinueClicked={sendContinueToNextRound}
                className={classNames(styles.width100)} // TODO remove this style
              />
            </VStack>
          )}
          {game.state === GameState.EndOfGame ? <Text>End of game</Text> : null}
          <JoinedPlayersList
            gameId={game.id}
            players={game.players}
            hideJoinUrl={game.state !== GameState.Lobby}
            className={classNames(
              [styles.joinedPlayersList],
              game.state === GameState.PlayersSubmittingWords
                ? styles.joinedPlayersListPlaying
                : null,
            )}
          />
          <Chat
            className={classNames(
              [styles.chat],
              game.state === GameState.PlayersSubmittingWords
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
