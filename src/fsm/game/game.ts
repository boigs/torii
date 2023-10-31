'use client';

import { assign, createMachine } from 'xstate';

import config from 'src/config';
import { Player } from 'src/domain';
import { GameState, WsMessage, WsType } from 'src/websocket';

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
    message: WsMessage;
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

const gameFsm = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoIEtYGMB7AO2LHwBdIBiAYQCUBRAQQBVGB9AcWYFlGA2gAYAuolAAHQrBwUcJcSAAeiAEwB2dZgAsAVgBsADlWHtQgMzb1Q-QBoQATzXnMARn2Whp7eYCcq1R8AXyD7VAxsPCJScioIagApAHkASQA5bj5BUUUpGTkFJGVEbT1MX3MNX3VtX1dfau17JwRtQ0whf0NDISFXXXUe9X0QsPQsfAAnMBQ5YiguceoIEiwcYgA3QgBrLHCJ6dn1hfGEda38I5JhERvc6Vl5YkUVBFV9LU6Td+ttetdXOpmohzPp9JgPK5OgCPOpLOZ1KMQPtMFMZnMThhqGBJpNCJNMBIADazABm+LQmBRaKO80WGDOm0IlwKxBudyKeUehVAr102kwukMmlUFQ0AX01WBCH0qkwGj+QiFrj8bTaSJRACtCOtjvSwMtVphzjs9uNMNrdXTTiaWU92TlOQ9WS9EEYBaLzL1he5fLoAtL4RD+bp3KpLFCEYjQsjzZbiHqlji8QTiWSKVS4zqE9aGbarmzRBzJM6nq6ELpKphNIZqqp-TYoa5pQBaQaYQwfKGVj6lKyuEIx4iECBwRT7e75MtFV7goUisXqCW+D6t9zg0HqKE1fR6AYGDXm3AEEhkSiQSfc54zkHacHdP6VIRLryBVuS8orlUq3ylfSuAJDwiGkMX1S8XRvN5dF8TAESsTst1KCNdGlQFwUlaD-i3AxKiArB40TDBwOnXkSg-FcBg8Mw6kMflAy9Dt1F0IQ9HrcwANcKw8MwIlCAAIz4loSynHligQLd2k40x9BY5jND+VCKlgqxVEBBEKn9cNByCIA */
  id: 'game',
  predictableActionArguments: true,
  tsTypes: {} as import('./game.typegen').Typegen0,
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
            cond: (_, event) => event.value.message.type === WsType.GameState,
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
            cond: (_, event) => event.value.message.type === WsType.GameState,
            actions: assign({
              players: (_, event) => (event.value.message as GameState).players,
            }),
          },
          {
            cond: (_, event) => event.value.message.type === WsType.Error,
            target: 'disconnected',
          },
        ],
      },
    },
  },
});

export default gameFsm;
