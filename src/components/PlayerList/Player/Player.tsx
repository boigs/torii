import React from 'react';

import { Avatar, Flex, Text } from '@chakra-ui/react';
import { RandomAvatar } from 'react-random-avatars';

import styles from './Player.module.scss';

type PlayerProps = {
  id: string;
  name: string;
};

const Player: React.FC<PlayerProps> = ({ name }) => {
  return (
    <Flex alignItems='center' gap='8px'>
      <RandomAvatar name={name} size={32} />
      <Text className={styles.playerName}>{name}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
