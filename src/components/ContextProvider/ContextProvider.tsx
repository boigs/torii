'use client';

import React, { ReactNode, createContext, useCallback, useEffect } from 'react';

import { UseToastOptions, useToast } from '@chakra-ui/react';
import { useActor, useInterpret } from '@xstate/react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { InterpreterFrom } from 'xstate';

import config from 'src/config';
import gameFsm from 'src/fsm/game';
import logger from 'src/logger';
import { HeadcrabError, WsMessageIn, WsTypeIn } from 'src/websocket/in';
import { WsMessageOut } from 'src/websocket/out';

type ContextType = {
  gameFsm: InterpreterFrom<typeof gameFsm>;
  sendWebsocketMessage: (message: WsMessageOut) => void;
};

export const Context = createContext<ContextType>({
  gameFsm: {} as InterpreterFrom<typeof gameFsm>,
  sendWebsocketMessage: () => {},
});

const UNKNOWN_WS_ERROR: UseToastOptions = {
  status: 'error',
  isClosable: true,
  duration: 3000,
  description: 'Unknown error occurred; please contact support.',
  position: 'top',
};

const HEARTBEAT = {
  message: 'ping',
  returnMessage: 'pong',
  timeout: 3000, // 3 seconds, if no response is received, the connection will be closed
  interval: 1000, // every 1 second, a ping message will be sent
};

const isWebsocketClosed = (state: ReadyState) => {
  return state === ReadyState.CLOSING || state === ReadyState.CLOSED;
};

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const gameMachineService = useInterpret(gameFsm);
  var [state, send] = useActor(gameMachineService);
  const toast = useToast();

  const websocketUrl = `${config.headcrabWsBaseUrl}/game/${state.context.gameId}/player/${state.context.nickname}/ws`;
  const { sendMessage, readyState, lastMessage } = useWebSocket(
    websocketUrl,
    {
      onError: (event) => onWebsocketError(event),
      heartbeat: HEARTBEAT,
    },
    state.context.websocketShouldBeConnected
  );

  const onWebsocketError: (event: Event) => void = useCallback(
    (event) => {
      logger.debug({ event }, 'event');
      if (!isWebsocketClosed(readyState)) {
        send('WEBSOCKET_CONNECT_ERROR');
        toast(UNKNOWN_WS_ERROR);
      }
    },
    [toast, send, readyState]
  );

  useEffect(() => {
    logger.debug({ state }, 'state');
  }, [state]);

  useEffect(() => {
    if (lastMessage) {
      var message: WsMessageIn = JSON.parse(lastMessage.data);
      // move this into an error state of the fsm, and let each screen decide what to do?
      // error message is printed twice, probably need to remember if we already saw it, or using an fsm for this would fix it
      if (message.type === WsTypeIn.Error) {
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

    logger.debug({ lastMessage }, 'last message');
  }, [lastMessage, send, toast]);

  return (
    <Context.Provider
      value={{
        gameFsm: gameMachineService,
        sendWebsocketMessage: (message) => sendMessage(JSON.stringify(message)),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
