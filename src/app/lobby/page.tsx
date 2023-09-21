'use client';

import React, { useEffect, useState } from 'react';

import { Button, Center } from '@chakra-ui/react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import PlayerList from 'src/components/PlayerList/PlayerList';

const Lobby: React.FC = () => {
  const [socketUrl, setSocketUrl] = useState('ws://localhost:4000');
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
      <Button onClick={handleClickSendMessage}>Send Message</Button>
    </Center>
  );
};

export default Lobby;
