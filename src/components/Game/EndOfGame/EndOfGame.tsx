import { Center, Text } from '@chakra-ui/react';

import AnimatedParent from 'src/components/Shared/AnimatedParent';
import Chat from 'src/components/Shared/Chat';
import JoinedPlayersList from 'src/components/Shared/JoinedPlayersList';
import { ChatMessage, GameState } from 'src/domain';
import { WsMessageOut } from 'src/websocket/out';

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
          sendWebsocketMessage={sendWebsocketMessage}
          className={styles.chat}
        />
      </AnimatedParent>
    </Center>
  );
};

export default EndOfGame;
