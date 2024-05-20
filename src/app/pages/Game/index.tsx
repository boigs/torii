import { useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useGameContext } from 'src/components/context/GameContextProvider';
import GameEnded from 'src/components/game/GameEnded';
import Lobby from 'src/components/game/Lobby';
import RoundEnded from 'src/components/game/RoundEnded';
import Voting from 'src/components/game/Voting';
import Words from 'src/components/game/Words';
import AnimatedParent from 'src/components/shared/AnimatedParent';
import Chat from 'src/components/shared/Chat';
import JoinedPlayersList from 'src/components/shared/JoinedPlayersList';
import LoadingCard from 'src/components/shared/LoadingCard';
import GameState from 'src/domain/gameState';

import styles from './Game.module.scss';

const Game = () => {
  const navigate = useNavigate();
  const { gameConnectionActor, game } = useGameContext();
  const [gameConnection] = [gameConnectionActor.getSnapshot()];

  useEffect(() => {
    if (gameConnection.matches('disconnected')) {
      navigate('/join', { replace: true });
    }
    if (gameConnection.matches('game') && !gameConnection.context.gameJoined) {
      gameConnectionActor.send({ type: 'GAME_JOINED' });
    }
  }, [gameConnection, navigate, gameConnectionActor]);

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
          {game.state === GameState.EndOfRound ? (
            <RoundEnded className={styles.game} />
          ) : null}
          {game.state === GameState.EndOfGame ? (
            <GameEnded className={styles.game} />
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
