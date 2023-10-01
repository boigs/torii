'use client';

import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Heading,
  Input,
  VStack,
  useClipboard,
} from '@chakra-ui/react';
import useWebSocket from 'react-use-websocket';

import PlayerList from 'src/components/PlayerList/PlayerList';
import config from 'src/config';

type GameQuery = {
  params: {
    id: string;
  };
};

const Game: React.FC<GameQuery> = ({ params: { id } }) => {
  const nickname = localStorage.getItem('nickname');
  const joinUrl = `${window.location.origin}/join/${id}`;
  const [socketUrl, _] = useState(
    `${config.headcrabWsBaseUrl}/game/${id}/player/${nickname}/ws`
  );
  const [players, setPlayers] = useState<{ nickname: string }[]>([]);
  const { sendMessage, lastMessage } = useWebSocket(socketUrl, { share: true });
  const { onCopy, hasCopied } = useClipboard(joinUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage);
      const message = JSON.parse(lastMessage.data);
      setPlayers(message.players);
    }
  }, [lastMessage]);

  return (
    <Center>
      <Card size='sm' width='md'>
        <CardHeader>
          <Heading as='h3' textAlign='center' size='md'>
            Waiting for other players
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack>
            <PlayerList players={players} />
            <Flex width='sm'>
              <Input value={joinUrl} contentEditable='false' mr='2' />
              <Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    </Center>
  );
};

export default Game;
