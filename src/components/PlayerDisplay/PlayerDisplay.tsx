import React, { useEffect, useState } from 'react';

import { Card } from '@chakra-ui/react';

import Player, { PlayerProps } from 'src/components/PlayerDisplay/Player';

import styles from './PlayerDisplay.module.scss';

const PlayerDisplay: React.FC = () => {
  const [players, setPlayers] = useState<PlayerProps[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/lobby')
      .then((response: any) => response.json())
      .then((response: any) => {
        setPlayers(response?.players ?? []);
      })
      .catch((error: Error) => console.log(error));
  }, []);

  return (
    <Card className={styles.playerDisplay}>
      {players.map((player) => (
        <Player key={player.id} {...player} />
      ))}
    </Card>
  );
};

export default PlayerDisplay;

