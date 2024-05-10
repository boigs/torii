import { Center } from '@chakra-ui/react';

import AnimatedParent from 'src/components/Shared/AnimatedParent';
import Chat from 'src/components/Shared/Chat';
import JoinedPlayersList from 'src/components/Shared/JoinedPlayersList';
import { ChatMessage, GameState } from 'src/domain';
import { WsMessageOut, startGame } from 'src/websocket/out';

import HostLobby, { HostLobbyValues } from './HostLobby';
import NonHostLobby from './NonHostLobby';

import styles from './Lobby.module.scss';

interface LobbyProps {
  game: GameState;
  messages: ChatMessage[];
  sendWebsocketMessage: (message: WsMessageOut) => void;
}

const Lobby = ({ game, messages, sendWebsocketMessage }: LobbyProps) => {
  const sendGameStart = (values: HostLobbyValues) => {
    sendWebsocketMessage(startGame({ amountOfRounds: values.amountOfRounds }));
  };

  return (
    <Center>
      <AnimatedParent className={styles.gameContainerGrid}>
        {game.player.isHost ? (
          <HostLobby onSubmit={sendGameStart} className={styles.lobby} />
        ) : (
          <NonHostLobby className={styles.lobby} />
        )}
        <JoinedPlayersList
          gameId={game.id}
          players={game.players}
          hideJoinUrl={false}
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

  return;
};

export default Lobby;
