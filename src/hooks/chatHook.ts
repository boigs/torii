import { useEffect, useState } from 'react';

import { useGameContext } from 'src/components/GameContextProvider';
import { ChatMessage } from 'src/domain';
import { artificialSleep } from 'src/helpers/sleep';
import { chatMessage } from 'src/websocket/out';

export interface ChatHook {
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
}

export const useChat = (): ChatHook => {
  const { sendWebsocketMessage, lastChatMessage } = useGameContext();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const sendChatMessage = async (text: string) => {
    await artificialSleep(100);
    sendWebsocketMessage(chatMessage({ content: text }));
  };

  useEffect(() => {
    if (lastChatMessage) {
      setChatMessages((previousChatMessages) => [
        ...previousChatMessages,
        lastChatMessage,
      ]);
    }
  }, [lastChatMessage]);

  return { chatMessages, sendChatMessage };
};
