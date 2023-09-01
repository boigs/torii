import React from 'react';

import { Card } from '@chakra-ui/react';

import Player, { PlayerProps } from 'src/components/PlayerDisplay/Player';

import styles from './PlayerDisplay.module.scss';

const players: PlayerProps[] = [
  {
    id: 'cccc',
    name: 'ccc',
  },
  {
    id: 'aaaa',
    name: 'aaaa',
  },
  {
    id: 'bbb',
    name: 'bbb',
  },
];

const PlayerDisplay: React.FC = () => {
  return (
    <Card className={styles.playerDisplay}>
      {players.map((player) => (
        <Player key={player.id} {...player} />
      ))}
    </Card>
  );
};

export default PlayerDisplay;
