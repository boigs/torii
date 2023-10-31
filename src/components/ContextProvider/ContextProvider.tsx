'use client';

import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { UseToastOptions, useToast } from '@chakra-ui/react';
import { useActor, useInterpret, useSelector } from '@xstate/react';
import useWebSocket from 'react-use-websocket';
import { InterpreterFrom } from 'xstate';

import config from 'src/config';
import gameFsm from 'src/fsm/game';
import { HeadcrabError, WsMessage, WsType } from 'src/websocket/types';

export const Context = createContext({
  gameFsm: {} as InterpreterFrom<typeof gameFsm>,
});

const UNKNOWN_WS_ERROR: UseToastOptions = {
  status: 'error',
  isClosable: true,
  duration: 5000,
  description: 'Unknown error occurred; please contact support.',
  position: 'top',
};

const HEARTBEAT = {
  message: 'ping',
  returnMessage: 'pong',
  timeout: 3000, // 3 seconds, if no response is received, the connection will be closed
  interval: 1000, // every 1 second, a ping message will be sent
};

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const gameMachineService = useInterpret(gameFsm);
  var [state, send] = useActor(gameMachineService);
  var isDisconnected = useSelector(gameMachineService, (state) =>
    state.matches('disconnected')
  );
  var isJoiningGame = useSelector(gameMachineService, (state) =>
    state.matches('joiningGame')
  );
  const toast = useToast();
  const [connectToGame, setConnectToGame] = useState<boolean>(false);

  const onWebsocketError: (event: Event) => void = useCallback(
    (event) => {
      console.log(event);
      send({ type: 'WEBSOCKET_CONNECT_ERROR' });
      toast(UNKNOWN_WS_ERROR);
    },
    [toast, send]
  );

  const websocketUrl = `${config.headcrabWsBaseUrl}/game/${state.context.gameId}/player/${state.context.nickname}/ws`;
  const { sendMessage, lastMessage } = useWebSocket(
    websocketUrl,
    {
      onError: onWebsocketError,
      heartbeat: HEARTBEAT,
    },
    connectToGame
  );

  useEffect(() => console.log(state), [state]);

  useEffect(() => {
    if (isDisconnected && connectToGame) {
      setConnectToGame(false);
    } else if (isJoiningGame && !connectToGame) {
      setConnectToGame(true);
    }
  }, [isDisconnected, isJoiningGame, connectToGame]);

  useEffect(() => {
    if (lastMessage) {
      var message: WsMessage = JSON.parse(lastMessage.data);
      // move this into an error state of the fsm, and let each screen decide what to do?
      // error message is printed twice, probably need to remember if we already saw it, or using an fsm for this would fix it
      if (message.type === WsType.Error) {
        toast({
          status: 'error',
          isClosable: true,
          duration: 5000,
          description: (message as HeadcrabError).message,
          position: 'top',
        });
      }

      send({
        type: 'WEBSOCKET_MESSAGE',
        value: { message: message },
      });
    }

    console.log(lastMessage);
  }, [lastMessage, send, toast]);

  return (
    <Context.Provider value={{ gameFsm: gameMachineService }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
