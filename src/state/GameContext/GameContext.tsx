'use client';

import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useToast } from '@chakra-ui/react';
import { last } from 'lodash';
import useWebSocket from 'react-use-websocket';

import config from 'src/config';

import { HEARTBEAT, UNKNOWN_WS_ERROR } from './constants';
import {
  GameContextType,
  GameState,
  HeadcrabError,
  Message,
  Player,
  Type,
} from './types';

const GameContext = createContext<GameContextType>({
  nickname: undefined,
  setNickname: () => {},
  setGameId: () => {},
  players: [],
  connected: false,
});

const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  const [nickname, setNickname] = useState<string | undefined>();
  const [gameId, setGameId] = useState<string | undefined>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [websocketUrl, setWebsocketUrl] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const onWebsocketError: (e: Event) => void = useCallback(
    (e) => {
      console.log(e);
      toast(UNKNOWN_WS_ERROR);
    },
    [toast]
  );

  const { sendMessage, lastMessage } = useWebSocket(websocketUrl, {
    onError: onWebsocketError,
    heartbeat: HEARTBEAT,
  });

  useEffect(() => {
    if (nickname && gameId) {
      setWebsocketUrl(
        `${config.headcrabWsBaseUrl}/game/${gameId}/player/${nickname}/ws`
      );
    }
  }, [nickname, gameId]);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage);
      const wsMessage: Message = JSON.parse(lastMessage.data);
      switch (wsMessage.type) {
        case Type.GameState:
          const { players } = wsMessage as GameState;
          setPlayers(players);
          setConnected(true);
          break;
        case Type.Error:
          const { message } = wsMessage as HeadcrabError;
          toast({
            status: 'error',
            isClosable: true,
            duration: 5000,
            description: message,
            position: 'top',
          });
          setWebsocketUrl(null);
          setNickname(undefined);
          break;
      }
    }
  }, [lastMessage, toast]);

  return (
    <GameContext.Provider
      value={{ nickname, setNickname, gameId, setGameId, players, connected }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext };
export default GameContextProvider;
