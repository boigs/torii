'use client';

import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { Button, Center } from '@chakra-ui/react';

import PlayerList from 'src/components/PlayerList/PlayerList';

const Lobby: React.FC = () => {
  const [socketUrl, setSocketUrl] = useState(
    'ws://localhost:4000/ws/game/A/player/dani'
  );
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log('last message: ' + lastMessage);
      console.log(lastMessage);
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = () => sendMessage('Hello');

  return (
    <Center>
      <Button onClick={handleClickSendMessage}>Send WS Message</Button>
    </Center>
  );
};

export default Lobby;
