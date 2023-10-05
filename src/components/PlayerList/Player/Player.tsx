import React, { useMemo } from 'react';

import { Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';

import styles from './Player.module.scss';

type PlayerProps = {
  nickname: string;
};

const AVATAR_BASE_URL =
  'https://api.dicebear.com/7.x/thumbs/png?backgroundColor=transparent';

const getAvatarUrl = (nickname: string) =>
  `${AVATAR_BASE_URL}&seed=${nickname}`;

const Player: React.FC<PlayerProps> = ({ nickname }) => {
  const avatar = useMemo(() => getAvatarUrl(nickname), [nickname]);

  return (
    <Flex alignItems='center' gap='8px'>
      <Image src={avatar} alt={nickname} width={32} height={32} />
      <Text className={styles.playerName}>{nickname}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
