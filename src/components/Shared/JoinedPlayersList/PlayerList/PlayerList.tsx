import { List, ListItem } from '@chakra-ui/react';

import { Player as PlayerDomain } from 'src/domain';

import PlayerComponent from './Player';

interface PlayerListProps {
  players: PlayerDomain[];
}

const PlayerList = ({ players }: PlayerListProps) => (
  <List spacing='12px'>
    {players.map((player) => (
      <ListItem key={player.nickname}>
        <PlayerComponent player={player} />
      </ListItem>
    ))}
  </List>
);

export default PlayerList;
