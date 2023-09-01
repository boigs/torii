import React, { useEffect, useState } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  List,
  ListItem,
} from '@chakra-ui/react';

import Player, { PlayerProps } from 'src/components/PlayerList/Player';

import styles from './PlayerList.module.scss';

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<PlayerProps[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/lobby')
      .then((response: any) => response.json())
      .then((response: any) => setPlayers(response?.players ?? []))
      .catch((error: Error) => console.log(error));
  }, []);

  return (
    <Card className={styles.playerDisplay} size='sm' width='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Players ({players.length})
        </Heading>
      </CardHeader>
      <CardBody>
        <List spacing='12px'>
          {players.map((player) => (
            <ListItem key={player.id}>
              <Player {...player} />
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  );
};

export default PlayerList;

