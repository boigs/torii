import { List, ListItem } from '@chakra-ui/react';

import PlayerComponent from 'src/components/JoinedPlayersList/PlayerList/Player';
import Player from 'src/domain/player';

interface PlayerListProps {
  players: Player[];
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
