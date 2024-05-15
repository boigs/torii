import { Flex } from '@chakra-ui/react';
import classNames from 'classnames';

import { useGameContext } from 'src/components/context/GameContextProvider';
import { WordScoresCard } from 'src/components/shared/WordScores';
import { continueToNextRound } from 'src/websocket/out';

import EndOfRound from '../../shared/EndOfRound';
import { RoundScoreCard } from '../Voting/RoundScore';

import styles from './RoundEnded.module.scss';

interface RoundEndedProps {
  className?: string;
}

const RoundEnded = ({ className }: RoundEndedProps) => {
  const { game, sendWebsocketMessage } = useGameContext();

  const sendContinueToNextRound = () => {
    sendWebsocketMessage(continueToNextRound());
  };

  return (
    <div className={classNames(className, styles.roundEndedContainer)}>
      <EndOfRound
        player={game.player}
        isLastRound={game.isLastRound()}
        onContinueClicked={sendContinueToNextRound}
      />
      <Flex className={styles.scoresContainer}>
        <RoundScoreCard players={game.players} round={game.lastRound()} />
        <WordScoresCard player={game.player} round={game.lastRound()} />
      </Flex>
    </div>
  );
};

export default RoundEnded;
