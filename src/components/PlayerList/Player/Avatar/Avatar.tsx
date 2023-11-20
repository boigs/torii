/* eslint-disable @next/next/no-img-element */
import React, { HTMLAttributes, useMemo } from 'react';

import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { HtmlProps } from 'next/dist/shared/lib/html-context.shared-runtime';

import styles from './Avatar.module.scss';

export type AvatarProps = {
  nickname: string;
  isHost?: boolean;
  size?: number;
  crownStyle?: HTMLAttributes<HtmlProps>['style'];
};

const DEFAULT_CROWN_SIZE = 32;
const DEFAULT_CROWN_STYLE: HTMLAttributes<HtmlProps>['style'] = {
  width: '18px',
  top: '-9px',
  left: '7px',
};

const Avatar: React.FC<AvatarProps> = ({
  nickname,
  isHost,
  size,
  crownStyle,
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
          className={styles.crown}
          src='/svg/crown.svg'
          alt='crown'
          style={crownStyle ?? DEFAULT_CROWN_STYLE}
        />
      ) : null}
    </div>
  );
};

export default Avatar;
