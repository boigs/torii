import classNames from 'classnames';

import { useGameContext } from 'src/components/context/GameContextProvider';
import { startGame } from 'src/websocket/out';

import HostLobby, { HostLobbyValues } from './HostLobby';
import Instructions from './Instructions';
import NonHostLobby from './NonHostLobby';

import styles from './Lobby.module.scss';

interface LobbyProps {
  className?: string;
}

const Lobby = ({ className }: LobbyProps) => {
  const { game, sendWebsocketMessage } = useGameContext();

  const sendGameStart = (values: HostLobbyValues) => {
    sendWebsocketMessage(startGame({ amountOfRounds: values.amountOfRounds }));
  };

  return (
    <div className={classNames(className, styles.lobbyContainer)}>
      <Instructions className={styles.instructions} />
      {game.player.isHost ? (
        <HostLobby onSubmit={sendGameStart} className={styles.lobby} />
      ) : (
        <NonHostLobby className={styles.lobby} />
      )}
    </div>
  );
};

export default Lobby;
