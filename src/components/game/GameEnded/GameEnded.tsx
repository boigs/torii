import classNames from 'classnames';

import { useGameContext } from 'src/components/context/GameContextProvider';
import { playAgain } from 'src/websocket/out';

import RoundDetails from './RoundDetails';
import Scoreboard from './Scoreboard';

import styles from './GameEnded.module.scss';

interface GameEndedProps {
  className?: string;
}

const GameEnded = ({ className }: GameEndedProps) => {
  const { game, sendWebsocketMessage } = useGameContext();

  const startNewGame = () => {
    sendWebsocketMessage(playAgain());
  };

  return (
    <div className={classNames(className, styles.gameEndedContainer)}>
      <Scoreboard
        player={game.player}
        players={game.players}
        rounds={game.rounds}
        onStartNewGameClicked={startNewGame}
      />
      <RoundDetails players={game.players} rounds={game.rounds} />
    </div>
  );
};

export default GameEnded;
