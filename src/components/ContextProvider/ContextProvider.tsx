'use client';

import { ReactNode, createContext, useCallback, useEffect } from 'react';

import { UseToastOptions, useToast } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import useWebSocket from 'react-use-websocket';
import { ActorRefFrom, fromPromise } from 'xstate';

import config from 'src/config';
import { HeadcrabState, Player } from 'src/domain';
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
  player: Player | undefined;
  isInsideOfGame: boolean;
}

export const Context = createContext<ContextType>({
  gameActor: {} as ActorRefFrom<typeof gameFsm>,
  sendWebsocketMessage: () => {
    throw new Error('Not implemented');
  },
  player: undefined,
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

  useEffect(() => {
    logger.debug({ state }, 'state');
  }, [state]);

  useEffect(() => {
    if (state.context.websocketShouldBeConnected && lastMessage) {
      // Ignore the heartbeat pong responses
      if (lastMessage.data === 'pong') {
        return;
      }

      const messageDto = JSON.parse(lastMessage.data as string) as WsMessageIn;
      // move this into an error state of the fsm, and let each screen decide what to do?
      // error message is printed twice, probably need to remember if we already saw it, or using an fsm for this would fix it
      switch (messageDto.kind) {
        case WsTypeIn.Error:
          {
            const error = headcrabErrorDtoToDomain(messageDto);

            if (shouldShowErrorToast(error.type)) {
              toast({
                status: 'error',
                isClosable: true,
                duration: 5000,
                description: headcrabErrorToString(error),
                position: 'top',
              });
            }

            if (shouldEndGameAfterError(error.type)) {
              // this event makes the FSM go to the "disconnected" state
              send({
                type: 'ERROR_MESSAGE',
                error,
              });
            }
          }
          break;
        case WsTypeIn.GameState: {
          const gameState = gameStateDtoToDomain(messageDto);
          send({
            type: 'GAME_STATE_MESSAGE',
            gameState,
          });
          if (state.context.game.state !== gameState.state) {
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
              case HeadcrabState.EndOfRound: {
                send({ type: 'CHANGED_TO_END_OF_ROUND' });
                break;
              }
              case HeadcrabState.EndOfGame: {
                send({ type: 'CHANGED_TO_END_OF_GAME' });
                break;
              }
              case HeadcrabState.Undefined: {
                break;
              }
            }
          }
          break;
        }
        case WsTypeIn.ChatText: {
          const chatMessage = chatMessageDtoToDomain(messageDto);
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
    toast,
    state.context.game.state,
    state.context.websocketShouldBeConnected,
  ]);

  return (
    <Context.Provider
      value={{
        gameActor: actorRef,
        sendWebsocketMessage: (message) => sendMessage(JSON.stringify(message)),
        player: actorRef
          .getSnapshot()
          .context.game.players.find(
            ({ nickname }) =>
              nickname === actorRef.getSnapshot().context.nickname
          ),
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
