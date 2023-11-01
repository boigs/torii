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

const CROWN_SVG = `
<svg height="32" width="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path style="fill:#ffea8a" d="M512 120.242c0-17.11-13.92-31.03-31.03-31.03s-31.03 13.92-31.03 31.03c0 8.555 3.48 16.313 9.098 21.931l-94.431 94.433-90.909-90.909c8.048-5.612 13.334-14.921 13.334-25.454 0-17.11-13.92-31.03-31.03-31.03s-31.03 13.92-31.03 31.03c0 10.533 5.286 19.842 13.334 25.454l-90.909 90.909-94.431-94.433c5.618-5.618 9.098-13.376 9.098-21.931 0-17.11-13.92-31.03-31.03-31.03S0 103.132 0 120.242c0 14.428 9.911 26.551 23.273 30.009v272.536h465.455V150.252C502.089 146.794 512 134.67 512 120.242z"/><path style="fill:#ffdb2d" d="M480.97 89.212c-17.11 0-31.03 13.92-31.03 31.03 0 8.555 3.48 16.313 9.098 21.931l-94.431 94.433-90.909-90.909c8.048-5.612 13.334-14.921 13.334-25.454 0-17.11-13.92-31.03-31.03-31.03v333.576h232.727V150.252c13.36-3.458 23.271-15.582 23.271-30.01 0-17.11-13.92-31.03-31.03-31.03z"/></svg>`;

const CROWN = `data:image/svg+xml;utf8,${encodeURIComponent(CROWN_SVG)}`;

const Player: React.FC<PlayerProps> = ({ nickname, isHost }) => {
  const avatar: string = useMemo(
    () =>
      createAvatar(thumbs, {
        seed: nickname,
        backgroundColor: ['transparent'],
        shapeOffsetX: [0],
        shapeOffsetY: [0],
        shapeRotation: [0],
      }).toString(),
    [nickname]
  );

  return (
    <Flex className={styles.player}>
      <div className={styles.avatarWrapper}>
        <img // https://stackoverflow.com/q/44900569
          width={32}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
          alt={nickname}
        />
        {isHost ? (
          <img className={styles.crown} width={18} src={CROWN} alt='crown' />
        ) : null}
      </div>
      <Text className={styles.playerName}>{nickname}</Text>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
