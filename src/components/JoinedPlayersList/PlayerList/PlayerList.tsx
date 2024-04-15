import React from 'react';

import { List, ListItem } from '@chakra-ui/react';

import PlayerComponent from 'src/components/JoinedPlayersList/PlayerList/Player';
import { Player } from 'src/domain';

type PlayerListProps = {
  players: Player[];
};

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <List spacing='12px'>
      {players.map((player) => (
        <ListItem key={player.nickname}>
          <PlayerComponent player={player} />
        </ListItem>
      ))}
    </List>
  );
};

export default PlayerList;
