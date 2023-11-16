/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from 'react';

import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

import styles from './Avatar.module.scss';

export type AvatarProps = {
  nickname: string;
  isHost?: boolean;
  size?: number;
};

const Avatar: React.FC<AvatarProps> = ({ nickname, isHost, size }) => {
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
    <div className={styles.avatarWrapper}>
      <img // https://stackoverflow.com/q/44900569
        width={size ?? 32}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
        alt={nickname}
      />
      {isHost ? (
        <img className={styles.crown} src='/svg/crown.svg' alt='crown' />
      ) : null}
    </div>
  );
};

export default Avatar;
