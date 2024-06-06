import { Flex } from '@chakra-ui/react';
import classNames from 'classnames';

import { useGameContext } from 'src/components/context/GameContextProvider';
import { WordScoresCard } from 'src/components/shared/WordScores';
import Player from 'src/domain/player';
import Word from 'src/domain/word';
import {
  acceptPlayersVotingWords,
  playerVotingWord,
  rejectMatchedWord,
} from 'src/websocket/out';

import MatchingPanel from './MatchingPanel';
import MatchingSummary from './MatchingSummary';
import VotingItems from './VotingItems';

import styles from './Matching.module.scss';

interface MatchingProps {
  className?: string;
}

const Matching = ({ className }: MatchingProps) => {
  const { game, sendWebsocketMessage } = useGameContext();
  const player = game.player;
  const round = game.lastRound();

  const sendPlayerVotingWord = (word: Word | null) => {
    sendWebsocketMessage(
      playerVotingWord({ word: word === null ? null : word.value }),
    );
  };

  const sendAcceptPlayersVotingWords = () => {
    sendWebsocketMessage(acceptPlayersVotingWords());
  };

  const rejectMatchingWord = (player: Player, word: string) => {
    sendWebsocketMessage(
      rejectMatchedWord({
        rejectedPlayer: player.nickname,
        rejectedWord: word,
      }),
    );
  };

  return (
    <div className={classNames(className, styles.matchingContainer)}>
      <Flex className={styles.col1}>
        <VotingItems
          player={game.player}
          round={round}
          className={styles.items}
        />
        <MatchingPanel
          player={player}
          round={round}
          onWordClicked={sendPlayerVotingWord}
          className={styles.card}
        />
      </Flex>
      <Flex className={styles.col2}>
        <MatchingSummary
          player={player}
          players={game.players}
          round={round}
          onAcceptButtonClicked={sendAcceptPlayersVotingWords}
          className={styles.summary}
          onWordRejected={rejectMatchingWord}
        />
        <WordScoresCard
          player={player}
          round={round}
          className={styles.scores}
        />
      </Flex>
    </div>
  );
};

export default Matching;
