import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  VStack,
  useClipboard,
} from '@chakra-ui/react';

import { Player } from 'src/domain';

import PlayerList from '../PlayerList';

type WaitingLobbyProps = {
  gameId: string;
  players: Player[];
};

const WaitingLobby: React.FC<WaitingLobbyProps> = ({ gameId, players }) => {
  const [joinUrl, setJoinUrl] = useState<string>('');
  const { onCopy, hasCopied } = useClipboard(joinUrl);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join/${gameId}`);
  }, [gameId]);

  return (
    <Card size='sm' width='md'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Waiting for other players
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack>
          <PlayerList
            players={players.map(({ nickname, isHost }) => ({
              nickname,
              isHost,
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
  );
};

export default WaitingLobby;
