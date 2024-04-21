import { List, ListItem } from '@chakra-ui/react';

import PlayerComponent from 'src/components/JoinedPlayersList/PlayerList/Player';
import { Player } from 'src/domain';

interface PlayerListProps {
  players: Player[];
}

function PlayerList({ players }: PlayerListProps) {
  return (
    <List spacing='12px'>
      {players.map((player) => (
        <ListItem key={player.nickname}>
          <PlayerComponent player={player} />
        </ListItem>
      ))}
    </List>
  );
}

export default PlayerList;
