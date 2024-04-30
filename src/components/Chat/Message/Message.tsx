import { HStack, Text } from '@chakra-ui/react';

import Avatar from 'src/components/JoinedPlayersList/PlayerList/Player/Avatar';
import Player from 'src/domain/player';

import styles from './Message.module.scss';

export interface MessageProps {
  sender: Player;
  content: string;
}

const Message = ({ sender, content }: MessageProps) => (
  <HStack className={styles.messageContainer}>
    <div className={styles.avatar}>
      <Avatar player={sender} size={24} />
    </div>
    <Text className={styles.message}>
      <span className={styles.messageSender}>{sender.nickname}:</span> {content}
    </Text>
  </HStack>
);

export default Message;
