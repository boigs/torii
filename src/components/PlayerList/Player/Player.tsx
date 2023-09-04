import React from 'react';

import { Avatar, Flex, Text } from '@chakra-ui/react';

import styles from './Player.module.scss';

type PlayerProps = {
  id: string;
  name: string;
};

const Player: React.FC<PlayerProps> = ({ name }) => {
  return (
    <Flex alignItems='center' gap='8px'>
      <Avatar src='https://bit.ly/sage-adebayo' />
      <Text className={styles.playerName}>{name}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
