/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from 'react';

import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import classNames from 'classnames';

import styles from './Avatar.module.scss';

export type AvatarProps = {
  nickname: string;
  isHost?: boolean;
  size?: number;
  crownClassName?: string;
};

const DEFAULT_CROWN_SIZE = 32;

const Avatar: React.FC<AvatarProps> = ({
  nickname,
  isHost,
  size,
  crownClassName,
}) => {
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
        width={size ?? DEFAULT_CROWN_SIZE}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
        alt={nickname}
      />
      {isHost ? (
        <img
          className={classNames([
            styles.crownBase,
            crownClassName ?? styles.defaultCrown,
          ])}
          src='/svg/crown.svg'
          alt='crown'
        />
      ) : null}
    </div>
  );
};

export default Avatar;
