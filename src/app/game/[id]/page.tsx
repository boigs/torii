'use client';

import { Center } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import useWebSocket from 'react-use-websocket';

import PlayerList from 'src/components/PlayerList/PlayerList';
import config from 'src/config';

type GameQuery = {
  params: {
    id: string;
  }
};

const Game: React.FC<GameQuery> = ({ params: { id } }) => {
  const nickname = localStorage.getItem('nickname');
  const [socketUrl, _] = useState(`${config.headcrabWsBaseUrl}/game/${id}/player/${nickname}/ws`);
  const [players, setPlayers] = useState<{ nickname: string }[]>([]);
  const { sendMessage, lastMessage } = useWebSocket(socketUrl, { share: true });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage);
      const message = JSON.parse(lastMessage.data);
      setPlayers(message.players);
    }
  }, [lastMessage]);

  return (
    <Center>
      <PlayerList players={players} />
    </Center>
  );
};

export default Game;
