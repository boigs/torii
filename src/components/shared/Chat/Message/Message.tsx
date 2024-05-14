import { HStack, Text } from '@chakra-ui/react';

import ChatMessage from 'src/domain/chatMessage';

import Avatar from '../../JoinedPlayersList/PlayerList/Player/Avatar';

import styles from './Message.module.scss';

export interface MessageProps {
  message: ChatMessage;
}

const Message = ({ message }: MessageProps) => (
  <HStack className={styles.messageContainer}>
    <div className={styles.avatar}>
      <Avatar player={message.sender} size={24} />
    </div>
    <Text className={styles.message}>
      <span className={styles.messageSender}>{message.sender.nickname}:</span>{' '}
      {message.content}
    </Text>
  </HStack>
);

export default Message;
