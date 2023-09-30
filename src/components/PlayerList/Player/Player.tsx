import React from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { RandomAvatar } from 'react-random-avatars';

import styles from './Player.module.scss';

type PlayerProps = {
  nickname: string;
};

const Player: React.FC<PlayerProps> = ({ nickname }) => {
  return (
    <Flex alignItems='center' gap='8px'>
      <RandomAvatar name={nickname} size={32} />
      <Text className={styles.playerName}>{nickname}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
