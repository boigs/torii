'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { UseToastOptions, useToast } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import useWebSocket from 'react-use-websocket';
import { ActorRefFrom, fromPromise } from 'xstate';

import config from 'src/config';
import { HeadcrabState } from 'src/domain';
import gameFsm from 'src/fsm/game';
import {
  headcrabErrorToString,
  shouldEndGameAfterError,
  shouldShowErrorToast,
} from 'src/helpers/errorHelpers';
import logger from 'src/logger';
import {
  WsMessageIn,
  WsTypeIn,
  chatMessageDtoToDomain,
  gameStateDtoToDomain,
  headcrabErrorDtoToDomain,
} from 'src/websocket/in';
import { WsMessageOut } from 'src/websocket/out';

interface ContextType {
  gameActor: ActorRefFrom<typeof gameFsm>;
  sendWebsocketMessage: (message: WsMessageOut) => void;
  isInsideOfGame: boolean;
}

export const Context = createContext<ContextType>({
  gameActor: {} as ActorRefFrom<typeof gameFsm>,
  sendWebsocketMessage: () => {
    throw new Error('Not implemented');
  },
  isInsideOfGame: false,
});

const UNKNOWN_WS_ERROR: UseToastOptions = {
  status: 'error',
  isClosable: true,
  duration: 3000,
  description: 'Unknown error occurred; please contact support.',
  position: 'top',
};

const CANNOT_CREATE_GAME_ERROR: UseToastOptions = {
  status: 'error',
  isClosable: true,
  duration: 3000,
  description: 'Could not create a game correctly. Please try again later.',
  position: 'top',
};

const HEARTBEAT = {
  message: 'ping',
  returnMessage: 'pong',
  timeout: 3000, // 3 seconds, if no response is received, the connection will be closed
  interval: 1000, // every 1 second, a ping message will be sent
};

const createGame: () => Promise<string> = () =>
  fetch(`${config.headcrabHttpBaseUrl}/game`, { method: 'POST' })
    .then((response) => response.json())
    .then((response) => (response as { id: string }).id);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  const gameActor = useActor(
    gameFsm.provide({
      actors: {
        createGame: fromPromise<string>(async () => {
          try {
            return await createGame();
          } catch (exception) {
            toast(CANNOT_CREATE_GAME_ERROR);
            throw exception;
          }
        }),
      },
    })
  );
  const [state, send, actorRef] = gameActor;

  const websocketUrl = `${config.headcrabWsBaseUrl}/game/${state.context.gameId}/player/${state.context.nickname}/ws`;
  const { sendMessage, lastMessage } = useWebSocket(
    websocketUrl,
    {
      heartbeat: HEARTBEAT,
      reconnectInterval: 500,
      onError: () => onWebsocketError(),
      shouldReconnect: () => state.context.websocketShouldBeConnected,
    },
    state.context.websocketShouldBeConnected
  );

  const onWebsocketError: () => void = useCallback(() => {
    if (!state.context.gameJoined) {
      send({ type: 'WEBSOCKET_CONNECT_ERROR' });
      toast(UNKNOWN_WS_ERROR);
    }
  }, [state.context.gameJoined, send, toast]);

  // Using a ref here as the GameState contains class objects that are recreated within the useEffect, using the object directly and including it as a useEffect depedency causes an infite loop
  const gameRef = useRef(state.context.game);

  useEffect(() => {
    logger.debug({ state }, 'state');
  }, [state]);

  useEffect(() => {
    if (state.context.websocketShouldBeConnected && lastMessage) {
      const message = lastMessage.data as string;

      // Ignore the heartbeat pong responses
      if (message === 'pong') {
        return;
      }

      const messageDto = JSON.parse(message) as WsMessageIn;
      switch (messageDto.kind) {
        case WsTypeIn.Error: {
          const headcrabError = headcrabErrorDtoToDomain(messageDto);

          if (shouldShowErrorToast(headcrabError.type)) {
            toast({
              status: 'error',
              isClosable: true,
              duration: 5000,
              description: headcrabErrorToString(headcrabError),
              position: 'top',
            });
          }

          if (shouldEndGameAfterError(headcrabError.type)) {
            send({
              type: 'ERROR_MESSAGE',
              headcrabError,
            });
          }

          break;
        }

        case WsTypeIn.GameState: {
          const gameState = gameStateDtoToDomain(
            messageDto,
            state.context.nickname
          );

          send({
            type: 'GAME_STATE_MESSAGE',
            gameState,
          });

          if (gameRef.current.state !== gameState.state) {
            switch (gameState.state) {
              case HeadcrabState.Lobby:
                send({ type: 'CHANGED_TO_LOBBY' });
                break;
              case HeadcrabState.PlayersSubmittingWords:
                send({ type: 'CHANGED_TO_PLAYERS_SUBMITTING_WORDS' });
                break;
              case HeadcrabState.PlayersSubmittingVotingWord:
                send({ type: 'CHANGED_TO_PLAYERS_SUBMITTING_VOTING_WORD' });
                break;
              case HeadcrabState.EndOfRound:
                send({ type: 'CHANGED_TO_END_OF_ROUND' });
                break;
              case HeadcrabState.EndOfGame:
                send({ type: 'CHANGED_TO_END_OF_GAME' });
                break;
              case HeadcrabState.Undefined:
                break;
            }
          }

          // The GameState is not used for rendering in the useEffect of this component, so it should be safe to update it
          // Just make sure it is updated at the end of this case block so the previous value is not overwritten before used
          gameRef.current = gameState;

          break;
        }

        case WsTypeIn.ChatText: {
          const chatMessage = chatMessageDtoToDomain(
            messageDto,
            gameRef.current.nicknameToPlayer
          );

          send({
            type: 'CHAT_MESSAGE',
            chatMessage,
          });

          break;
        }
      }

      logger.debug({ lastMessage }, 'last message');
    }
  }, [
    lastMessage,
    send,
    state.context.nickname,
    state.context.websocketShouldBeConnected,
    toast,
  ]);

  return (
    <Context.Provider
      value={{
        gameActor: actorRef,
        sendWebsocketMessage: (message) => sendMessage(JSON.stringify(message)),
        isInsideOfGame:
          actorRef.getSnapshot().matches('lobby') ||
          actorRef.getSnapshot().matches('playersSubmittingWords') ||
          actorRef.getSnapshot().matches('playersSubmittingVotingWord'),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
