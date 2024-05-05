/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react';

import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import classNames from 'classnames';

import { Player } from 'src/domain';

import styles from './Avatar.module.scss';

export interface AvatarProps {
  player: Player;
  size?: 24 | 32;
  crownClassName?: string;
}

const DEFAULT_CROWN_SIZE = 32;

const Avatar = ({ player, size, crownClassName }: AvatarProps) => {
  const avatar: string = useMemo(
    () =>
      createAvatar(thumbs, {
        seed: player.nickname,
        backgroundColor: ['transparent'],
        shapeOffsetX: [0],
        shapeOffsetY: [0],
        shapeRotation: [0],
        faceOffsetY: [-10, 15],
      }).toString(),
    [player.nickname],
  );

  return (
    <div className={styles.avatarWrapper}>
      <img // https://stackoverflow.com/q/44900569
        width={size ?? DEFAULT_CROWN_SIZE}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
        alt={player.nickname}
      />
      {player.isHost ? (
        <img
          className={classNames([
            styles.crownBase,
            size === 24 ? styles.crown24 : styles.crown32, // add more if needed
            crownClassName,
          ])}
          src='/svg/crown.svg'
          alt='crown'
        />
      ) : null}
    </div>
  );
};

export default Avatar;
