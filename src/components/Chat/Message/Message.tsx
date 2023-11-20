import React from 'react';

import { HStack, Text } from '@chakra-ui/react';

import Avatar from 'src/components/PlayerList/Player/Avatar';

import styles from './Message.module.scss';

export type MessageProps = {
  sender: string;
  content: string;
};

const Message: React.FC<MessageProps> = ({ sender, content }) => {
  return (
    <>
      <HStack className={styles.messageContainer}>
        <Avatar
          nickname={sender}
          size={24}
          crownClassName={styles.crown}
          isHost={true}
        />
        <Text className={styles.message}>
          <span className={styles.messageSender}>{sender}:</span> {content}
        </Text>
      </HStack>
    </>
  );
};

export default Message;
