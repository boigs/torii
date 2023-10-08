'use client';

import React, { useCallback, useEffect, useState } from 'react';

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
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { join } from 'path';
import useWebSocket from 'react-use-websocket';

import { PlayerProps } from 'src/components/PlayerList/Player';
import PlayerList from 'src/components/PlayerList/PlayerList';
import config from 'src/config';

type GameQuery = {
  params: {
    id: string;
  };
};

enum Type {
  Error = 'Error',
  GameState = 'GameState',
}

type MessageType = {
  type: Type;
};

type HeadcrabError = {
  message: string;
};

type GameState = {
  players: PlayerProps[];
};

type Message = MessageType & (GameState | HeadcrabError);

const Game: React.FC<GameQuery> = ({ params: { id } }) => {
  const toast = useToast();
  const router = useRouter();

  const nickname = localStorage.getItem('nickname');
  const joinUrl = `${window.location.origin}/join/${id}`;
  const [players, setPlayers] = useState<{ nickname: string }[]>([]);
  const { onCopy, hasCopied } = useClipboard(joinUrl);

  const [socketUrl, _] = useState(
    `${config.headcrabWsBaseUrl}/game/${id}/player/${nickname}/ws`
  );

  const onWebsocketError: (e: Event) => void = useCallback(
    (e) => {
      console.log('WS Error', e);
      toast({
        status: 'error',
        isClosable: true,
        duration: 5000,
        description: 'Unknown error occurred; please contact support.',
        position: 'top',
      });
    },
    [toast]
  );
  const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
    onError: onWebsocketError,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage);
      const wsMessage: Message = JSON.parse(lastMessage.data);
      switch (wsMessage.type) {
        case Type.GameState:
          const { players } = wsMessage as GameState;
          setPlayers(players);
          break;
        case Type.Error:
          const { message } = wsMessage as HeadcrabError;
          toast({
            status: 'error',
            isClosable: true,
            duration: 5000,
            description: message,
            position: 'top',
          });
          router.push(joinUrl);
          break;
      }
    }
  }, [lastMessage, toast, router, joinUrl]);

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
            <Flex width='100%'>
              <Input
                defaultValue={joinUrl.replace(/https?:\/\/(www.)?/g, '')}
                isReadOnly={true}
                mr='2'
              />
              <Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    </Center>
  );
};

export default Game;
