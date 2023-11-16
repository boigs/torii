import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Input,
  VStack,
  useClipboard,
} from '@chakra-ui/react';

import { Player } from 'src/domain';

import PlayerList from '../PlayerList';

import styles from './WaitingLobby.module.scss';

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
    <Card size='sm' className={styles.waitingLobbyCard}>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Players ({players.length})
        </Heading>
        <Divider marginTop={'12px'} />
      </CardHeader>
      <CardBody className={styles.waitingLobbyBody}>
        <Card>
          <CardBody>
            <PlayerList
              players={players.map(({ nickname, isHost }) => ({
                nickname,
                isHost,
              }))}
            />
          </CardBody>
        </Card>
      </CardBody>
      <CardFooter>
        <Flex>
          <Input
            className={styles.joinUrlInput}
            defaultValue={joinUrl.replace(/https?:\/\/(www.)?/g, '')}
            isReadOnly={true}
            mr='2'
          />
          <Button
            colorScheme='blue'
            onClick={onCopy}
            className={styles.copyButton}
          >
            {hasCopied ? 'Copied!' : 'Copy'}
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default WaitingLobby;
