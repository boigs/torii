'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';

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
import useWebSocket from 'react-use-websocket';

import PlayerList from 'src/components/PlayerList/PlayerList';
import config from 'src/config';
import GameContext from 'src/state/GameContext';

type GameQuery = {
  params: {
    id: string;
  };
};

enum Type {
  Error = 'error',
  GameState = 'gameState',
}

type MessageType = {
  type: Type;
};

type HeadcrabError = {
  message: string;
};

type Player = {
  nickname: string;
  isHost: boolean;
};

type GameState = {
  players: Player[];
};

type Message = MessageType & (GameState | HeadcrabError);

const Game: React.FC<GameQuery> = () => {
  const toast = useToast();
  const router = useRouter();

  const { nickname, gameId } = useContext(GameContext);
  const [joinUrl, setJoinUrl] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const { onCopy, hasCopied } = useClipboard(joinUrl);

  const [socketUrl, _] = useState(
    `${config.headcrabWsBaseUrl}/game/${gameId}/player/${nickname}/ws`
  );

  useEffect(() => {
    if (gameId) {
      setJoinUrl(`${window.location.origin}/join/${gameId}`);
    } else {
      window.location.href = '/';
    }
  }, [gameId]);

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
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 3000, // 3 seconds, if no response is received, the connection will be closed
      interval: 1000, // every 1 second, a ping message will be sent
    },
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
            <PlayerList
              players={players.map((player) => ({
                nickname: player.nickname,
                isHost: player.isHost,
              }))}
            />
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
