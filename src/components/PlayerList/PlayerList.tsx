import React, { useEffect, useState } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  List,
  ListItem,
} from '@chakra-ui/react';

import Player, { PlayerProps } from 'src/components/PlayerList/Player';

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<PlayerProps[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/lobby')
      .then((response: any) => response.json())
      .then((response: any) => setPlayers(response?.players ?? []))
      .catch((error: Error) => console.log(error));
  }, []);

  return (
    <Card size='sm' width='sm'>
      <CardHeader paddingBottom={0}>
        <Heading as='h3' textAlign='center' size='md'>
          Players ({players.length})
        </Heading>
        <Divider marginTop={'12px'} />
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
