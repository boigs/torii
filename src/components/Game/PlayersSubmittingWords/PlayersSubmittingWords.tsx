import { Center } from '@chakra-ui/react';
import classNames from 'classnames';

import AnimatedParent from 'src/components/Shared/AnimatedParent';
import Chat from 'src/components/Shared/Chat';
import JoinedPlayersList from 'src/components/Shared/JoinedPlayersList';
import { ChatMessage, GameState } from 'src/domain';
import { artificialSleep } from 'src/helpers/sleep';
import { WsMessageOut, playerWords } from 'src/websocket/out';

import WordsInput from './WordsInput';

import styles from './PlayersSubmittingWords.module.scss';

interface PlayersSubmittingWordsProps {
  game: GameState;
  messages: ChatMessage[];
  sendWebsocketMessage: (message: WsMessageOut) => void;
}

const PlayersSubmittingWords = ({
  game,
  messages,
  sendWebsocketMessage,
}: PlayersSubmittingWordsProps) => {
  const sendPlayerWords = async (words: string[]) => {
    sendWebsocketMessage(playerWords({ words }));
    await artificialSleep(350);
  };

  return (
    <Center>
      <AnimatedParent className={styles.gameContainerGrid}>
        <WordsInput
          player={game.player}
          round={game.lastRound()}
          onSubmit={sendPlayerWords}
          className={classNames(styles.wordsInput, styles.wordsInputPlaying)}
        />
        <JoinedPlayersList
          gameId={game.id}
          players={game.players}
          hideJoinUrl={true}
          className={classNames(
            styles.joinedPlayersList,
            styles.joinedPlayersListPlaying,
          )}
        />
        <Chat
          messages={messages}
          sendWebsocketMessage={sendWebsocketMessage}
          className={classNames(styles.chat, styles.chatPlaying)}
        />
      </AnimatedParent>
    </Center>
  );
};

export default PlayersSubmittingWords;
