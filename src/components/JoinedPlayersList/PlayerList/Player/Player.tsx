import { Flex, Text, Tooltip } from '@chakra-ui/react';
import classNames from 'classnames';

import type { Player } from 'src/domain';

import Avatar from './Avatar';

import styles from './Player.module.scss';

interface PlayerProps {
  player: Player;
}

function Player({ player }: PlayerProps) {
  const disconnected = !player.isConnected;

  return (
    <Tooltip
      placement='left'
      hasArrow
      label={disconnected ? `"${player.nickname}" has left` : null}
    >
      <Flex
        className={classNames(
          [styles.player],
          disconnected ? styles.disconnected : null
        )}
      >
        <>
          <Avatar player={player} />
          <Text className={styles.playerName}>{player.nickname}</Text>
        </>
      </Flex>
    </Tooltip>
  );
}

export default Player;
export type { PlayerProps };
