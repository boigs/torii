import { MutableRefObject, useEffect, useState } from 'react';

import useWebSocket from 'react-use-websocket';

import ChatMessage from 'src/domain/chatMessage';
import Game from 'src/domain/game';
import GameError from 'src/domain/gameError';
import Player from 'src/domain/player';
import logger from 'src/logger';
import {
  WsMessageIn,
  WsTypeIn,
  chatMessageDtoToDomain,
  gameDtoToDomain,
  gameErrorDtoToDomain,
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
}

export interface WebsocketHook {
  lastGameState: Game | null;
  lastChatMessage: ChatMessage | null;
  lastGameError: GameError | null;
  lastWebsocketError: string | null;
  sendWebsocketMessage: (message: WsMessageOut) => void;
}

export const useWebsocket = ({
  connect,
  headcrabWsBaseUrl,
  gameId,
  nickname,
  nicknameToPlayerRef,
}: WebsocketHookIn): WebsocketHook => {
  const websocketUrl = `${headcrabWsBaseUrl}/game/${gameId}/player/${nickname}/ws`;
  const { sendMessage, lastMessage } = useWebSocket(
    websocketUrl,
    {
      heartbeat: HEARTBEAT,
      reconnectInterval: 500,
      onError: (event: Event) => {
        setLastWebsocketError(event.type);
      },
      shouldReconnect: () => connect,
    },
    connect,
  );
  const [lastGameState, setLastGameState] = useState<Game | null>(null);
  const [lastChatMessage, setLastChatMessage] = useState<ChatMessage | null>(
    null,
  );
  const [lastGameError, setLastGameError] = useState<GameError | null>(null);
  const [lastWebsocketError, setLastWebsocketError] = useState<string | null>(
    null,
  );

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
          setLastGameState(gameDtoToDomain(messageDto, gameId, nickname));
          break;

        case WsTypeIn.ChatText:
          setLastChatMessage(
            chatMessageDtoToDomain(messageDto, nicknameToPlayerRef.current),
          );
          break;

        case WsTypeIn.Error:
          setLastGameError(gameErrorDtoToDomain(messageDto));
          break;
      }

      logger.debug({ lastMessage }, 'last message');
    }
  }, [connect, gameId, lastMessage, nickname, nicknameToPlayerRef]);

  return {
    lastGameState,
    lastChatMessage,
    lastGameError,
    lastWebsocketError,
    sendWebsocketMessage: (message: WsMessageOut) =>
      sendMessage(JSON.stringify(message)),
  };
};
