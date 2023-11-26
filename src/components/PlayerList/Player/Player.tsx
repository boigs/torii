import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

import Avatar from './Avatar';

import styles from './Player.module.scss';
import { Player } from 'src/domain';

type PlayerProps = {
  player: Player;
};

const Player: React.FC<PlayerProps> = ({ player }) => {
  return (
    <Flex className={styles.player}>
      <Avatar player={player} />
      <Text className={styles.playerName}>{player.nickname}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
