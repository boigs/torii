import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';

import styles from './Lobby.module.scss';

type LobbyProps = {
  className?: string;
};

const Lobby: React.FC<LobbyProps> = ({ className }) => {
  return (
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
          <Spinner
            thickness='4px'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
            speed='1.75s'
          />
        </Center>
      </CardBody>
    </Card>
  );
};

export default Lobby;
