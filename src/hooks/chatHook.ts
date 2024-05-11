import { Dispatch, SetStateAction, useState } from 'react';

import { ChatMessage } from 'src/domain';
import { artificialSleep } from 'src/helpers/sleep';
import { WsMessageOut, chatMessage } from 'src/websocket/out';

export interface ChatHook {
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
}

export interface WebsocketChatHook {
  useChat: () => ChatHook;
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export const useWebsocketChat = (
  sendWebsocketMessage: (message: WsMessageOut) => void,
): WebsocketChatHook => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const sendChatMessage = async (text: string) => {
    await artificialSleep(100);
    sendWebsocketMessage(chatMessage({ content: text }));
  };

  return {
    useChat: () => {
      return { chatMessages, sendChatMessage };
    },
    setChatMessages,
  };
};
