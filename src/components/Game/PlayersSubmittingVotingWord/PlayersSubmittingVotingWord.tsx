import { Center, VStack } from '@chakra-ui/react';
import classNames from 'classnames';

import AnimatedParent from 'src/components/AnimatedParent';
import Chat from 'src/components/Chat';
import JoinedPlayersList from 'src/components/JoinedPlayersList';
import VotingCard from 'src/components/VotingCard';
import VotingItems from 'src/components/VotingItems';
import VotingSummary from 'src/components/VotingSummary';
import { WordScoresCard } from 'src/components/WordScores';
import { ChatMessage, GameState, Word } from 'src/domain';
import { artificialSleep } from 'src/helpers/sleep';
import {
  WsMessageOut,
  acceptPlayersVotingWords,
  chatMessage,
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
  const sendChatMessage = async (content: string) => {
    await artificialSleep(100);
    sendWebsocketMessage(chatMessage({ content }));
  };

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
          onSubmit={sendChatMessage}
          className={styles.chat}
        />
      </AnimatedParent>
    </Center>
  );
};

export default PlayersSubmittingVotingWord;
