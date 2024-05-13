'use client';

import { useEffect } from 'react';

import { Center, Text, VStack } from '@chakra-ui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import { useGameContext } from 'src/components/GameContextProvider';
import EndOfRound from 'src/components/game/EndOfRound';
import HostLobby, {
  HostLobbyValues,
} from 'src/components/game/Lobby/HostLobby';
import NonHostLobby from 'src/components/game/Lobby/NonHostLobby';
import VotingCard from 'src/components/game/Voting/VotingCard';
import VotingItems from 'src/components/game/Voting/VotingItems';
import VotingSummary from 'src/components/game/Voting/VotingSummary';
import WordsInput from 'src/components/game/Words/WordsInput';
import AnimatedParent from 'src/components/shared/AnimatedParent';
import Chat from 'src/components/shared/Chat';
import JoinedPlayersList from 'src/components/shared/JoinedPlayersList';
import LoadingCard from 'src/components/shared/LoadingCard';
import { WordScoresCard } from 'src/components/shared/WordScores';
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
  const { gameConnectionActor, game, sendWebsocketMessage } = useGameContext();
  const [gameConnection] = [gameConnectionActor.getSnapshot()];

  useEffect(() => {
    if (gameConnection.matches('disconnected')) {
      router.replace('/join');
    }
    if (gameConnection.matches('game') && !gameConnection.context.gameJoined) {
      gameConnectionActor.send({ type: 'GAME_JOINED' });
    }
  }, [gameConnection, router, gameConnectionActor]);

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
          <Card header='Placeholder' className={styles.game}></Card>
          <JoinedPlayersList
            gameId={game.id}
            players={game.players}
            hideJoinUrl={game.state !== GameState.Lobby}
            className={styles.joinedPlayers}
          />
          <Chat className={styles.chat} />
        </AnimatedParent>
      )}
    </Center>
  );
};

export default Game;
