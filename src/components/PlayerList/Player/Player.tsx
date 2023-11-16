import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

import Avatar from './Avatar';

import styles from './Player.module.scss';

type PlayerProps = {
  nickname: string;
  isHost: boolean;
};

const Player: React.FC<PlayerProps> = ({ nickname, isHost }) => {
  return (
    <Flex className={styles.player}>
      <Avatar isHost={isHost} nickname={nickname} />
      <Text className={styles.playerName}>{nickname}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
