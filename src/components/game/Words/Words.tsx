import classNames from 'classnames';

import { useGameContext } from 'src/components/context/GameContextProvider';
import { artificialSleep } from 'src/helpers/sleep';
import { playerWords } from 'src/websocket/out';

import WordsInput from './WordsInput';

import styles from './Words.module.scss';

interface WordsProps {
  className?: string;
}

const Words = ({ className }: WordsProps) => {
  const { game, sendWebsocketMessage } = useGameContext();

  const sendPlayerWords = async (words: string[]) => {
    sendWebsocketMessage(playerWords({ words }));
    await artificialSleep(350);
  };

  return (
    <WordsInput
      player={game.player}
      round={game.lastRound()}
      onSubmit={sendPlayerWords}
      className={classNames(className, styles.wordsInput)}
    />
  );
};

export default Words;
