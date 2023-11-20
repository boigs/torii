import React, { HTMLAttributes } from 'react';

import { HStack, Text } from '@chakra-ui/react';
import { HtmlProps } from 'next/dist/shared/lib/html-context.shared-runtime';

import Avatar from 'src/components/PlayerList/Player/Avatar';

import styles from './Message.module.scss';

export type MessageProps = {
  sender: string;
  content: string;
};

const CROWN_STYLE: HTMLAttributes<HtmlProps>['style'] = {
  width: '13.5px',
  top: '-7px',
  left: '5.15px',
};

const Message: React.FC<MessageProps> = ({ sender, content }) => {
  return (
    <>
      <HStack className={styles.messageContainer}>
        <Avatar nickname={sender} size={24} crownStyle={CROWN_STYLE} />
        <Text className={styles.message}>
          <span className={styles.messageSender}>{sender}:</span> {content}
        </Text>
      </HStack>
    </>
  );
};

export default Message;
