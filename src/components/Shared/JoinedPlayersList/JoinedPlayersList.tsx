import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Input,
  VStack,
  useClipboard,
} from '@chakra-ui/react';
import classNames from 'classnames';

import { Player } from 'src/domain';

import PlayerList from './PlayerList';

import styles from './JoinedPlayersList.module.scss';

interface WaitingLobbyProps {
  gameId: string;
  players: Player[];
  hideJoinUrl?: boolean;
  className?: string;
}

const JoinedPlayersList = ({
  gameId,
  players,
  hideJoinUrl,
  className,
}: WaitingLobbyProps) => {
  const joinUrl = `${window.location.origin}/join/${gameId}`;
  const { onCopy, hasCopied } = useClipboard(joinUrl);

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
        <VStack className={styles.playerList}>
          <PlayerList players={players} />
        </VStack>
      </CardBody>
      {!hideJoinUrl && (
        <CardFooter className={classNames(styles.joinUrlContainer)}>
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
        </CardFooter>
      )}
    </Card>
  );
};

export default JoinedPlayersList;
