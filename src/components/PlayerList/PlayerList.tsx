import React from 'react';

import { List, ListItem } from '@chakra-ui/react';

import Player from 'src/components/PlayerList/Player';

type PlayerListProps = {
  players: { nickname: string; isHost: boolean }[];
};

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <List spacing='12px'>
      {players.map((player) => (
        <ListItem key={player.nickname}>
          <Player nickname={player.nickname} isHost={player.isHost} />
        </ListItem>
      ))}
    </List>
  );
};

export default PlayerList;
