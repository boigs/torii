'use client';

import { ReactNode, createContext, useContext, useEffect, useRef } from 'react';

import { UseToastOptions, useToast } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { ActorRefFrom, fromPromise } from 'xstate';

import config from 'src/config';
import ChatMessage from 'src/domain/chatMessage';
import HeadcrabState from 'src/domain/headcrabState';
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
  sendWebsocketMessage: (message: WsMessageOut) => void;
  lastChatMessage: ChatMessage | null;
  isInsideOfGame: boolean;
}

const GameContext = createContext<GameContextType>({
  gameActor: {} as ActorRefFrom<typeof gameFsm>,
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
    }),
  );
  const [state, send, actorRef] = gameActor;

  // Using a ref here as the nicknameToPlayer is a Map and gets reconstructed every time we get a new GameState message
  // which would cause the useWebsocket hook to be reacreated, causing the same GameState message to trigger a new lastGameState message
  // causing an infinite loop
  const nicknameToPlayerRef = useRef(state.context.game.nicknameToPlayer);

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
        gameState: lastGameState,
      });

      if (lastGameState.state !== state.context.game.state) {
        switch (lastGameState.state) {
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

      // A ref object keeps the initialized value unless it is manually updated
      nicknameToPlayerRef.current = lastGameState.nicknameToPlayer;
    }
  }, [lastGameState, send, state.context.game.state]);

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
          headcrabError: lastError,
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
        sendWebsocketMessage,
        lastChatMessage,
        isInsideOfGame:
          actorRef.getSnapshot().matches('lobby') ||
          actorRef.getSnapshot().matches('playersSubmittingWords') ||
          actorRef.getSnapshot().matches('playersSubmittingVotingWord') ||
          actorRef.getSnapshot().matches('endOfRound') ||
          actorRef.getSnapshot().matches('endOfGame'),
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => useContext(GameContext);
