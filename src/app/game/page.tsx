'use client';

import React, { useContext, useEffect, useState } from 'react';

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
import { useActor, useSelector } from '@xstate/react';
import { useRouter } from 'next/navigation';

import PlayerList from 'src/components/PlayerList/PlayerList';
import { GameFiniteStateMachineContext } from 'src/state/GameContext/gameState';

const Game: React.FC = () => {
  const router = useRouter();
  const { service } = useContext(GameFiniteStateMachineContext);
  const [state] = useActor(service);
  const [joinUrl, setJoinUrl] = useState<string>('');
  var isDisconnected = useSelector(service, (state) =>
    state.matches('disconnected')
  );

  const { onCopy, hasCopied } = useClipboard(joinUrl);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join/${state.context.gameId}`);
    if (isDisconnected) {
      router.replace('/');
    }
  }, [isDisconnected]);

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
              players={state.context.players.map((player) => ({
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
