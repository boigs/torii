import React from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  List,
  ListItem,
} from '@chakra-ui/react';

import Player from 'src/components/PlayerList/Player';

type PlayerListProps = {
  players: { nickname: string }[];
};

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
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
            <ListItem key={player.nickname}>
              <Player nickname={player.nickname} />
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  );
};

export default PlayerList;
