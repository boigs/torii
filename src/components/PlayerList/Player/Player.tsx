/* eslint-disable @next/next/no-img-element */
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
        shapeOffsetX: [0],
        shapeOffsetY: [0],
        shapeRotation: [0],
        faceOffsetY: [-10, 15],
      }).toString(),
    [nickname]
  );

  return (
    <Flex className={styles.player}>
      <div className={styles.avatarWrapper}>
        <img // https://stackoverflow.com/q/44900569
          className={styles.thumb}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
          alt={nickname}
        />
        {isHost ? (
          <img className={styles.crown} src='crown.svg' alt='crown' />
        ) : null}
      </div>
      <Text className={styles.playerName}>{nickname}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
