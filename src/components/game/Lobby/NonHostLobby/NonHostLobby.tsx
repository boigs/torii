import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Heading,
  Text,
} from '@chakra-ui/react';

import Spinner from 'src/components/shared/Spinner';

import styles from './Lobby.module.scss';

interface LobbyProps {
  className?: string;
}

const NonHostLobby = ({ className }: LobbyProps) => (
  <Card size='sm' className={className}>
    <CardHeader>
      <Heading as='h3' textAlign='center' size='md'>
        Lobby
      </Heading>
      <Divider marginTop='12px' />
    </CardHeader>
    <CardBody className={styles.body}>
      <Text align='center' className={styles.text}>
        Please wait until the host starts the game.
      </Text>
      <Center>
        <Spinner />
      </Center>
    </CardBody>
  </Card>
);

export default NonHostLobby;
