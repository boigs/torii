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
  useClipboard,
} from '@chakra-ui/react';
import classNames from 'classnames';

import PlayerList from 'src/components/PlayerList';
import { Player } from 'src/domain';

import styles from './WaitingLobby.module.scss';

type WaitingLobbyProps = {
  gameId: string;
  players: Player[];
  className?: string;
};

const WaitingLobby: React.FC<WaitingLobbyProps> = ({
  gameId,
  players,
  className,
}) => {
  const [joinUrl, setJoinUrl] = useState<string>('');
  const { onCopy, hasCopied } = useClipboard(joinUrl);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join/${gameId}`);
  }, [gameId]);

  return (
    <Card
      size='sm'
      className={classNames([styles.waitingLobbyCard, className])}
    >
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Players ({players.length})
        </Heading>
        <Divider marginTop={'12px'} />
      </CardHeader>
      <CardBody className={styles.waitingLobbyBody}>
        <Card>
          <CardBody className={styles.players}>
            <PlayerList players={players} />
          </CardBody>
        </Card>
      </CardBody>
      <CardFooter>
        <Flex className={styles.footerContainer}>
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
