import classNames from 'classnames';

import { useGameContext } from 'src/components/context/GameContextProvider';

import RoundDetails from './RoundDetails';
import Scoreboard from './Scoreboard';

import styles from './GameEnded.module.scss';

interface GameEndedProps {
  className?: string;
}

const GameEnded = ({ className }: GameEndedProps) => {
  const { game } = useGameContext();

  return (
    <div className={classNames(className, styles.gameEndedContainer)}>
      <Scoreboard players={game.players} rounds={game.rounds} />
      <RoundDetails players={game.players} rounds={game.rounds} />
    </div>
  );
};

export default GameEnded;
