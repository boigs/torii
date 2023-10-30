'use client';

import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useToast } from '@chakra-ui/react';
import { useActor, useInterpret, useSelector } from '@xstate/react';
import useWebSocket from 'react-use-websocket';
import { InterpreterFrom, assign, createMachine } from 'xstate';

import config from 'src/config';

import { HEARTBEAT, UNKNOWN_WS_ERROR } from './constants';
import { GameState, HeadcrabError, Message, Player, Type } from './types';

type CreateGameEvent = {
  type: 'CREATE_GAME';
  value: {
    nickname: string;
  };
};

type JoinGameEvent = {
  type: 'JOIN_GAME';
  value: {
    gameId: string;
    nickname: string;
  };
};

type WebsocketMessageEvent = {
  type: 'WEBSOCKET_MESSAGE';
  value: {
    message: Message;
  };
};

type WebsocketConnectErrorEvent = {
  type: 'WEBSOCKET_CONNECT_ERROR';
};

type Context = {
  gameId: string | undefined;
  nickname: string | undefined;
  players: Player[];
};

const createGame = () =>
  fetch(`${config.headcrabHttpBaseUrl}/game`, { method: 'POST' })
    .then((response) => response.json())
    .then((response) => (response as { id: string }).id);

const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoIEtYGMB7AO2LHwBdIBiAYQCUBRAQQBVGB9AcWYFlGA2gAYAuolAAHQrBwUcJcSAAeiAEwB2dZgAsAVgBsADlWHtQgMzb1Q-QBoQATzXnMARn2Whp7eYCcq1R8AXyD7VAxsPCJScioIagApAHkASQA5bj5BUUUpGTkFJGVEbT1MX3MNX3VtX1dfau17JwRtQ0whf0NDISFXXXUe9X0QsPQsfAAnMBQ5YiguceoIEiwcYgA3QgBrLHCJ6dn1hfGEda38I5JhERvc6Vl5YkUVBFV9LU6Td+ttetdXOpmohzPp9JgPK5OgCPOpLOZ1KMQPtMFMZnMThhqGBJpNCJNMBIADazABm+LQmBRaKO80WGDOm0IlwKxBudyKeUehVAr102kwukMmlUFQ0AX01WBCH0qkwGj+QiFrj8bTaSJRACtCOtjvSwMtVphzjs9uNMNrdXTTiaWU92TlOQ9WS9EEYBaLzL1he5fLoAtL4RD+bp3KpLFCEYjQsjzZbiHqlji8QTiWSKVS4zqE9aGbarmzRBzJM6nq6ELpKphNIZqqp-TYoa5pQBaQaYQwfKGVj6lKyuEIx4iECBwRT7e75MtFV7goUisXqCW+D6t9zg0HqKE1fR6AYGDXm3AEEhkSiQSfc54zkHacHdP6VIRLryBVuS8orlUq3ylfSuAJDwiGkMX1S8XRvN5dF8TAESsTst1KCNdGlQFwUlaD-i3AxKiArB40TDBwOnXkSg-FcBg8Mw6kMflAy9Dt1F0IQ9HrcwANcKw8MwIlCAAIz4loSynHligQLd2k40x9BY5jND+VCKlgqxVEBBEKn9cNByCIA */
  id: 'game',
  predictableActionArguments: true,
  tsTypes: {} as import('./gameState.typegen').Typegen0,
  schema: {
    events: {} as
      | CreateGameEvent
      | JoinGameEvent
      | WebsocketConnectErrorEvent
      | WebsocketMessageEvent,
    context: {} as Context,
  },
  context: {
    gameId: undefined,
    nickname: undefined,
    players: [],
  },
  initial: 'disconnected',
  states: {
    disconnected: {
      on: {
        CREATE_GAME: {
          target: 'creatingGame',
          actions: assign({ nickname: (_, event) => event.value.nickname }),
        },
        JOIN_GAME: {
          target: 'joiningGame',
          actions: assign({
            nickname: (_, event) => event.value.nickname,
            gameId: (_, event) => event.value.gameId,
          }),
        },
      },
    },
    creatingGame: {
      invoke: {
        src: () => createGame(),
        onDone: {
          target: 'joiningGame',
          actions: [assign({ gameId: (_, event) => event.data })],
        },
        onError: 'disconnected',
      },
    },
    joiningGame: {
      entry: async (context, event) => {
        console.log('probando');
        console.log(context);
      },
      on: {
        WEBSOCKET_MESSAGE: [
          {
            cond: (_, event) => event.value.message.type === Type.GameState,
            target: 'lobby',
            actions: assign({
              players: (_, event) => (event.value.message as GameState).players,
            }),
          },
          'disconnected',
        ],
        WEBSOCKET_CONNECT_ERROR: 'disconnected',
      },
    },
    lobby: {
      on: {
        WEBSOCKET_MESSAGE: [
          {
            cond: (_, event) => event.value.message.type === Type.GameState,
            actions: assign({
              players: (_, event) => (event.value.message as GameState).players,
            }),
          },
          {
            cond: (_, event) => event.value.message.type === Type.Error,
            target: 'disconnected',
          },
        ],
      },
    },
  },
});

export const GameFiniteStateMachineContext = createContext({
  service: {} as InterpreterFrom<typeof gameMachine>,
});

const GameFiniteStateMachineProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const gameMachineService = useInterpret(gameMachine);
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
    [toast]
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

  useEffect(() => {
    console.log(state);
    if (isDisconnected && connectToGame) {
      setConnectToGame(false);
    } else if (isJoiningGame && !connectToGame) {
      setConnectToGame(true);
    }

    if (connectToGame && lastMessage) {
      var message: Message = JSON.parse(lastMessage.data);
      // move this into an error state of the fsm, and let each screen decide what to do?
      // error message is print twice, probably needd to remember if we already saw it, or using an fsm for this would fix it
      if (message.type === Type.Error) {
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
        value: { message: message},
      });
    }

    console.log(lastMessage);
  }, [isDisconnected, isJoiningGame, connectToGame, lastMessage]);

  return (
    <GameFiniteStateMachineContext.Provider
      value={{ service: gameMachineService }}
    >
      {children}
    </GameFiniteStateMachineContext.Provider>
  );
};

export default GameFiniteStateMachineProvider;
