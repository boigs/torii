import React from 'react';

import { useGameContext } from 'src/components/GameContextProvider';
import { startGame } from 'src/websocket/out';

import HostLobby, { HostLobbyValues } from './HostLobby';
import NonHostLobby from './NonHostLobby';

interface LobbyProps {
  className?: string;
}

const Lobby = ({ className }: LobbyProps) => {
  const { game, sendWebsocketMessage } = useGameContext();

  const sendGameStart = (values: HostLobbyValues) => {
    sendWebsocketMessage(startGame({ amountOfRounds: values.amountOfRounds }));
  };

  return game.player.isHost ? (
    <HostLobby onSubmit={sendGameStart} className={className} />
  ) : (
    <NonHostLobby className={className} />
  );
};

export default Lobby;
