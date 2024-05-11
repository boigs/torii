import { MutableRefObject, useEffect, useRef, useState } from 'react';

import useWebSocket from 'react-use-websocket';

import ChatMessage from 'src/domain/chatMessage';
import GameState from 'src/domain/gameState';
import HeadcrabError from 'src/domain/headcrabError';
import Player from 'src/domain/player';
import logger from 'src/logger';
import {
  WsMessageIn,
  WsTypeIn,
  chatMessageDtoToDomain,
  gameStateDtoToDomain,
  headcrabErrorDtoToDomain,
} from 'src/websocket/in';
import { WsMessageOut } from 'src/websocket/out';

const HEARTBEAT = {
  message: 'ping',
  returnMessage: 'pong',
  timeout: 3000, // 3 seconds, if no response is received, the connection will be closed
  interval: 1000, // every 1 second, a ping message will be sent
};

export interface WebsocketHookIn {
  connect: boolean;
  headcrabWsBaseUrl: string;
  gameId: string;
  nickname: string;
  nicknameToPlayerRef: MutableRefObject<Map<string, Player>>;
  onWebsocketError: () => void;
}

export interface WebsocketHook {
  lastGameState: GameState | null;
  lastChatMessage: ChatMessage | null;
  lastError: HeadcrabError | null;
  sendWebsocketMessage: (message: WsMessageOut) => void;
}

export const useWebsocket = ({
  connect,
  headcrabWsBaseUrl,
  gameId,
  nickname,
  nicknameToPlayerRef,
  onWebsocketError,
}: WebsocketHookIn): WebsocketHook => {
  const websocketUrl = `${headcrabWsBaseUrl}/game/${gameId}/player/${nickname}/ws`;
  const { sendMessage, lastMessage } = useWebSocket(
    websocketUrl,
    {
      heartbeat: HEARTBEAT,
      reconnectInterval: 500,
      onError: () => {
        onWebsocketError();
      },
      shouldReconnect: () => connect,
    },
    connect,
  );
  const [lastGameState, setLastGameState] = useState<GameState | null>(null);
  const [lastChatMessage, setLastChatMessage] = useState<ChatMessage | null>(
    null,
  );
  const [lastError, setLastError] = useState<HeadcrabError | null>(null);

  useEffect(() => {
    if (connect && lastMessage) {
      const message = lastMessage.data as string;

      // Ignore the heartbeat pong responses
      if (message === 'pong') {
        return;
      }

      const messageDto = JSON.parse(message) as WsMessageIn;
      switch (messageDto.kind) {
        case WsTypeIn.GameState:
          setLastGameState(gameStateDtoToDomain(messageDto, nickname));
          break;

        case WsTypeIn.ChatText:
          setLastChatMessage(
            chatMessageDtoToDomain(messageDto, nicknameToPlayerRef.current),
          );
          break;

        case WsTypeIn.Error:
          setLastError(headcrabErrorDtoToDomain(messageDto));
          break;
      }

      logger.debug({ lastMessage }, 'last message');
    }
  }, [connect, lastMessage, nickname, nicknameToPlayerRef]);

  return {
    lastGameState,
    lastChatMessage,
    lastError,
    sendWebsocketMessage: (message: WsMessageOut) =>
      sendMessage(JSON.stringify(message)),
  };
};
