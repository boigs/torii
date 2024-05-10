import { Center, VStack } from '@chakra-ui/react';
import classNames from 'classnames';

import VotingCard from 'src/components/GamePage/PlayersSubmittingVotingWord/VotingCard';
import VotingItems from 'src/components/GamePage/PlayersSubmittingVotingWord/VotingItems';
import VotingSummary from 'src/components/GamePage/PlayersSubmittingVotingWord/VotingSummary';
import AnimatedParent from 'src/components/Shared/AnimatedParent';
import Chat from 'src/components/Shared/Chat';
import JoinedPlayersList from 'src/components/Shared/JoinedPlayersList';
import { WordScoresCard } from 'src/components/Shared/WordScores';
import { ChatMessage, GameState, Word } from 'src/domain';
import {
  WsMessageOut,
  acceptPlayersVotingWords,
  playerVotingWord,
} from 'src/websocket/out';

import styles from './PlayersSubmittingVotingWord.module.scss';

interface PlayersSubmittingVotingWordProps {
  game: GameState;
  messages: ChatMessage[];
  sendWebsocketMessage: (message: WsMessageOut) => void;
}

const PlayersSubmittingVotingWord = ({
  game,
  messages,
  sendWebsocketMessage,
}: PlayersSubmittingVotingWordProps) => {
  const sendPlayerVotingWord = (word: Word | null) => {
    sendWebsocketMessage(
      playerVotingWord({ word: word === null ? null : word.value }),
    );
  };

  const sendAcceptPlayersVotingWords = () => {
    sendWebsocketMessage(acceptPlayersVotingWords());
  };

  // TODO remove this VStack container
  return (
    <Center>
      <AnimatedParent className={styles.gameContainerGrid}>
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
        <JoinedPlayersList
          gameId={game.id}
          players={game.players}
          hideJoinUrl={true}
          className={styles.joinedPlayersList}
        />
        <Chat
          messages={messages}
          sendWebsocketMessage={sendWebsocketMessage}
          className={styles.chat}
        />
      </AnimatedParent>
    </Center>
  );
};

export default PlayersSubmittingVotingWord;
