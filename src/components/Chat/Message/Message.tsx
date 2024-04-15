import React from 'react';

import { HStack, Text } from '@chakra-ui/react';

import Avatar from 'src/components/JoinedPlayersList/PlayerList/Player/Avatar';
import { Player } from 'src/domain';

import styles from './Message.module.scss';

export type MessageProps = {
  sender: Player;
  content: string;
};

const Message: React.FC<MessageProps> = ({ sender, content }) => {
  return (
    <>
      <HStack className={styles.messageContainer}>
        <div className={styles.avatar}>
          <Avatar player={sender} size={24} crownClassName={styles.crown} />
        </div>
        <Text className={styles.message}>
          <span className={styles.messageSender}>{sender.nickname}:</span>{' '}
          {content}
        </Text>
      </HStack>
    </>
  );
};

export default Message;
