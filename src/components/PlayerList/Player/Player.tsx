import React, { useMemo } from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

import styles from './Player.module.scss';

type PlayerProps = {
  nickname: string;
  isHost: boolean;
};

const Player: React.FC<PlayerProps> = ({ nickname, isHost }) => {
  const avatar: string = useMemo(
    () =>
      createAvatar(thumbs, {
        seed: nickname,
        backgroundColor: ['transparent'],
      }).toString(),
    [nickname]
  );

  return (
    <Flex alignItems='center' gap='8px'>
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img // https://stackoverflow.com/q/44900569
        width={32}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
        alt={nickname}
      />
      <Text className={styles.playerName}>{nickname}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
