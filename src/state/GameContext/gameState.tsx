'use client';

import React, { ReactNode, createContext } from 'react';

import { useInterpret } from '@xstate/react';
import {
  AnyInterpreter,
  AnyStateMachine,
  Interpreter,
  InterpreterFrom,
  StateMachine,
  assign,
  createMachine,
} from 'xstate';

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

type CreateGameService = {
  data: {
    gameId: string;
  };
};

type JoinGameService = {
  data: {};
};

type Context = {
  gameId: string | undefined;
  nickname: string | undefined;
  lastMessage: string | undefined;
};

const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoIEtYGMB7AO2LHwBdIBiAYQCUBRAQQBVGB9AcWYFlGA2gAYAuolAAHQrBwUcJcSAAeiAEwB2dZgAsAVgBsADlWHtQgMzb1Q-QBoQATzXnMARn2Whp7eYCcq1R8AXyD7VAxsPCJScioIagApAHkASQA5bj5BUUUpGTkFJGVEbT1MX3MNX3VtX1dfau17JwRtQ0whf0NDISFXXXUe9X0QsPQsfAAnMBQ5YiguceoIEiwcYgA3QgBrLHCJ6dn1hfGEda38I5JhERvc6Vl5YkUVBFV9LU6Td+ttetdXOpmohzPp9JgPK5OgCPOpLOZ1KMQPtMFMZnMThhqGBJpNCJNMBIADazABm+LQmBRaKO80WGDOm0IlwKxBudyKeUehVAr102kwukMmlUFQ0AX01WBCH0qkwGj+QiFrj8bTaSJRACtCOtjvSwMtVphzjs9uNMNrdXTTiaWU92TlOQ9WS9EEYBaLzL1he5fLoAtL4RD+bp3KpLFCEYjQsjzZbiHqlji8QTiWSKVS4zqE9aGbarmzRBzJM6nq6ELpKphNIZqqp-TYoa5pQBaQaYQwfKGVj6lKyuEIx4iECBwRT7e75MtFV7goUisXqCW+D6t9zg0HqKE1fR6AYGDXm3AEEhkSiQSfc54zkHacHdP6VIRLryBVuS8orlUq3ylfSuAJDwiGkMX1S8XRvN5dF8TAESsTst1KCNdGlQFwUlaD-i3AxKiArB40TDBwOnXkSg-FcBg8Mw6kMflAy9Dt1F0IQ9HrcwANcKw8MwIlCAAIz4loSynHligQLd2k40x9BY5jND+VCKlgqxVEBBEKn9cNByCIA */
    id: 'game',
    tsTypes: {} as import('./gameState.typegen').Typegen0,
    schema: {
      events: {} as CreateGameEvent | JoinGameEvent,
      services: {} as {
        createGame: CreateGameService;
        joinGame: JoinGameService;
      },
      context: {} as Context,
    },
    context: {
      gameId: undefined,
      nickname: undefined,
      lastMessage: undefined,
    },
    initial: 'disconnected',
    states: {
      disconnected: {
        on: {
          // When sending these two events, send the nickname and use an action to store it on the context
          CREATE_GAME: { target: 'creatingGame', actions: 'assignNickname' },
          JOIN_GAME: {
            target: 'joiningGame',
            actions: ['assignGameId', 'assignNickname'],
          },
        },
      },
      creatingGame: {
        entry: [],
        invoke: {
          src: 'createGame',
          onDone: { target: 'joiningGame', actions: ['assignGameId'] },
          onError: 'disconnected',
        },
      },
      joiningGame: {
        invoke: {
          src: 'joinGame',
          onDone: 'lobby',
          onError: 'disconnected',
        },
      },
      lobby: {},
    },
  },
  {
    actions: {
      assignNickname: assign((_, event) => {
        return { nickname: event.value.nickname };
      }),
      assignGameId: assign((_, event) => {
        let gameId: string;
        if (event.type === 'JOIN_GAME') {
          gameId = (event as JoinGameEvent).value.gameId;
        } else {
          gameId = event.data.gameId;
        }
        return { gameId };
      }),
    },
  }
);

export const GameFiniteStateMachineContext = createContext({
  service: {} as InterpreterFrom<typeof gameMachine>,
});

const GameFiniteStateMachineProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const gameMachineService = useInterpret(gameMachine, {
    services: {
      createGame: async () => ({ gameId: '' }),
      joinGame: async () => ({}),
    },
  });

  return (
    <>
      <GameFiniteStateMachineContext.Provider
        value={{ service: gameMachineService }}
      >
        {children}
      </GameFiniteStateMachineContext.Provider>
    </>
  );
};

export default GameFiniteStateMachineProvider;
