'use client';

import { useEffect } from 'react';

import { Center, Text, VStack } from '@chakra-ui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import { useGameContext } from 'src/components/GameContextProvider';
import EndOfRound from 'src/components/game/EndOfRound';
import Lobby from 'src/components/game/Lobby';
import Voting from 'src/components/game/Voting';
import Words from 'src/components/game/Words';
import AnimatedParent from 'src/components/shared/AnimatedParent';
import Chat from 'src/components/shared/Chat';
import JoinedPlayersList from 'src/components/shared/JoinedPlayersList';
import LoadingCard from 'src/components/shared/LoadingCard';
import GameState from 'src/domain/gameState';
import { continueToNextRound } from 'src/websocket/out';

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

  const sendContinueToNextRound = () => {
    sendWebsocketMessage(continueToNextRound());
  };

  return (
    <Center>
      {gameConnection.matches('disconnected') ? (
        <LoadingCard />
      ) : (
        <AnimatedParent className={styles.gameContainerGrid}>
          {game.state === GameState.Lobby ? (
            <Lobby className={styles.game} />
          ) : null}
          {game.state === GameState.PlayersSubmittingWords ? (
            <Words className={styles.game} />
          ) : null}
          {game.state === GameState.PlayersSubmittingVotingWord ? (
            <Voting className={styles.game} />
          ) : null}

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
