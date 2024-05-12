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
import Game from 'src/domain/game';
import gameConnectionFsm from 'src/fsm';
import {
  gameErrorToString,
  shouldEndGameAfterError,
  shouldShowErrorToast,
} from 'src/helpers/errorHelpers';
import { useWebsocket } from 'src/hooks/useWebsocket';
import logger from 'src/logger';
import { WsMessageOut } from 'src/websocket/out';

interface GameContextType {
  gameConnectionActor: ActorRefFrom<typeof gameConnectionFsm>;
  game: Game;
  sendWebsocketMessage: (message: WsMessageOut) => void;
  lastChatMessage: ChatMessage | null;
}

const GameContext = createContext<GameContextType>({
  gameConnectionActor: {} as ActorRefFrom<typeof gameConnectionFsm>,
  game: Game.default,
  sendWebsocketMessage: () => {
    throw new Error('Not implemented');
  },
  lastChatMessage: null,
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

  const [gameConnection, , gameConnectionActor] = useActor(
    gameConnectionFsm.provide({
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

  const [game, setGame] = useState(Game.default);
  // Using a ref here as the nicknameToPlayer is a Map and gets reconstructed every time we get a new GameState message
  // which would cause the useWebsocket hook to be reacreated, causing the same GameState message to trigger a new lastGameState message
  // causing an infinite loop
  // A ref object keeps the initialized value unless it is manually updated
  const nicknameToPlayerRef = useRef(game.nicknameToPlayer);
  nicknameToPlayerRef.current = game.nicknameToPlayer;

  const {
    lastGameState,
    lastChatMessage,
    lastGameError,
    lastWebsocketError,
    sendWebsocketMessage,
  } = useWebsocket({
    connect: gameConnection.context.connect,
    headcrabWsBaseUrl: config.headcrabWsBaseUrl,
    gameId: gameConnection.context.gameId,
    nickname: gameConnection.context.nickname,
    nicknameToPlayerRef,
  });

  useEffect(() => {
    logger.debug({ gameConnection }, 'gameConnection');
  }, [gameConnection]);

  useEffect(() => {
    if (lastGameState) {
      if (gameConnection.matches('joiningGame')) {
        gameConnectionActor.send({
          type: 'JOIN_GAME_SUCCESS',
        });
      }

      setGame(lastGameState);
    }
  }, [
    gameConnection,
    gameConnection.context.gameJoined,
    gameConnectionActor,
    lastGameState,
  ]);

  useEffect(() => {
    if (lastGameError) {
      if (shouldShowErrorToast(lastGameError.type)) {
        toast({
          status: 'error',
          isClosable: true,
          duration: 5000,
          description: gameErrorToString(lastGameError),
          position: 'top',
        });
      }

      if (shouldEndGameAfterError(lastGameError.type)) {
        gameConnectionActor.send({
          type: 'RESET',
        });
      }
    }
  }, [gameConnectionActor, lastGameError, toast]);

  useEffect(() => {
    if (lastWebsocketError) {
      // This hides the errors when in the middle of a game and Headcrab dies,
      // but prevents an error from showing when a mobile browser goes into pause state and later reconnects and rejoins the game
      if (!gameConnection.matches('game')) {
        logger.error(lastWebsocketError);
        gameConnectionActor.send({ type: 'GAME_CONNECTION_ERROR' });
        toast(UNKNOWN_WS_ERROR);
      }
    }
  }, [
    gameConnection,
    gameConnection.context.gameJoined,
    gameConnectionActor,
    lastWebsocketError,
    toast,
  ]);

  return (
    <GameContext.Provider
      value={{
        gameConnectionActor,
        game,
        sendWebsocketMessage,
        lastChatMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => useContext(GameContext);
