import { Center, Text } from '@chakra-ui/react';

import AnimatedParent from 'src/components/AnimatedParent';
import Chat from 'src/components/Chat';
import JoinedPlayersList from 'src/components/JoinedPlayersList';
import { ChatMessage, GameState } from 'src/domain';
import { artificialSleep } from 'src/helpers/sleep';
import { WsMessageOut, chatMessage } from 'src/websocket/out';

import styles from './EndOfGame.module.scss';

interface EndOfRoundProps {
  game: GameState;
  messages: ChatMessage[];
  sendWebsocketMessage: (message: WsMessageOut) => void;
}

const EndOfGame = ({
  game,
  messages,
  sendWebsocketMessage,
}: EndOfRoundProps) => {
  const sendChatMessage = async (content: string) => {
    await artificialSleep(100);
    sendWebsocketMessage(chatMessage({ content }));
  };

  return (
    <Center>
      <AnimatedParent className={styles.gameContainerGrid}>
        <Text>End of game</Text>
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

export default EndOfGame;
