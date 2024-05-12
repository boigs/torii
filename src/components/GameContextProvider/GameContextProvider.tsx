'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { UseToastOptions, useToast } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { ActorRefFrom, fromPromise } from 'xstate';

import config from 'src/config';
import ChatMessage from 'src/domain/chatMessage';
import GameState from 'src/domain/gameState';
import gameFsm from 'src/fsm';
import {
  headcrabErrorToString,
  shouldEndGameAfterError,
  shouldShowErrorToast,
} from 'src/helpers/errorHelpers';
import { useWebsocket } from 'src/hooks/useWebsocket';
import logger from 'src/logger';
import { WsMessageOut } from 'src/websocket/out';

interface GameContextType {
  gameActor: ActorRefFrom<typeof gameFsm>;
  game: GameState;
  sendWebsocketMessage: (message: WsMessageOut) => void;
  lastChatMessage: ChatMessage | null;
  isInsideOfGame: boolean;
}

const GameContext = createContext<GameContextType>({
  gameActor: {} as ActorRefFrom<typeof gameFsm>,
  game: GameState.default,
  sendWebsocketMessage: () => {
    throw new Error('Not implemented');
  },
  lastChatMessage: null,
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

const createGame: () => Promise<string> = () =>
  fetch(`${config.headcrabHttpBaseUrl}/game`, { method: 'POST' })
    .then((response) => response.json())
    .then((response) => (response as { id: string }).id);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();

  const [state, send, actorRef] = useActor(
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
    }),
  );

  const [gameState, setGameState] = useState(GameState.default);
  // Using a ref here as the nicknameToPlayer is a Map and gets reconstructed every time we get a new GameState message
  // which would cause the useWebsocket hook to be reacreated, causing the same GameState message to trigger a new lastGameState message
  // causing an infinite loop
  // A ref object keeps the initialized value unless it is manually updated
  const nicknameToPlayerRef = useRef(gameState.nicknameToPlayer);
  nicknameToPlayerRef.current = gameState.nicknameToPlayer;

  const {
    lastGameState,
    lastChatMessage,
    lastError,
    lastWebsocketError,
    sendWebsocketMessage,
  } = useWebsocket({
    connect: state.context.websocketShouldBeConnected,
    headcrabWsBaseUrl: config.headcrabWsBaseUrl,
    gameId: state.context.gameId,
    nickname: state.context.nickname,
    nicknameToPlayerRef,
  });

  useEffect(() => {
    logger.debug({ state }, 'state');
  }, [state]);

  useEffect(() => {
    if (lastGameState) {
      send({
        type: 'GAME_STATE_MESSAGE',
      });

      setGameState(lastGameState);
    }
  }, [lastGameState, send]);

  useEffect(() => {
    if (lastError) {
      if (shouldShowErrorToast(lastError.type)) {
        toast({
          status: 'error',
          isClosable: true,
          duration: 5000,
          description: headcrabErrorToString(lastError),
          position: 'top',
        });
      }

      if (shouldEndGameAfterError(lastError.type)) {
        send({
          type: 'ERROR_MESSAGE',
        });
      }
    }
  }, [lastError, send, toast]);

  useEffect(() => {
    if (lastWebsocketError) {
      if (!state.context.gameJoined) {
        send({ type: 'WEBSOCKET_CONNECT_ERROR' });
        toast(UNKNOWN_WS_ERROR);
      }
    }
  }, [lastError, lastWebsocketError, send, state.context.gameJoined, toast]);

  return (
    <GameContext.Provider
      value={{
        gameActor: actorRef,
        game: gameState,
        sendWebsocketMessage,
        lastChatMessage,
        isInsideOfGame: actorRef.getSnapshot().matches('game'),
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => useContext(GameContext);
