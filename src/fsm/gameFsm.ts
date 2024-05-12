'use client';

import { assertEvent, assign, fromPromise, setup } from 'xstate';

import GameState from 'src/domain/gameState';
import HeadcrabError from 'src/domain/headcrabError';
import HeadcrabState from 'src/domain/headcrabState';

interface CreateGameEvent {
  type: 'CREATE_GAME';
  nickname: string;
}

interface JoinGameEvent {
  type: 'JOIN_GAME';
  gameId: string;
  nickname: string;
}

interface GameJoinedEvent {
  type: 'GAME_JOINED';
}

interface ErrorMessageEvent {
  type: 'ERROR_MESSAGE';
  headcrabError: HeadcrabError;
}

interface GameStateMessageEvent {
  type: 'GAME_STATE_MESSAGE';
  gameState: GameState;
}

interface WebsocketConnectErrorEvent {
  type: 'WEBSOCKET_CONNECT_ERROR';
}

interface ResetEvent {
  type: 'RESET';
}

interface Context {
  gameId: string;
  nickname: string;
  game: GameState;
  websocketShouldBeConnected: boolean;
  gameJoined: boolean;
}

const defaultContext: Context = {
  gameId: '',
  nickname: '',
  game: new GameState({
    player: { nickname: 'unset', isHost: false, isConnected: false },
    nicknameToPlayer: new Map(),
    rounds: [],
    state: HeadcrabState.Undefined,
    amountOfRounds: null,
  }),
  websocketShouldBeConnected: false,
  gameJoined: false,
};

const gameFsm = setup({
  types: {} as {
    context: Context;
    events:
      | CreateGameEvent
      | JoinGameEvent
      | GameJoinedEvent
      | ResetEvent
      | WebsocketConnectErrorEvent
      | ErrorMessageEvent
      | GameStateMessageEvent;
  },
  actions: {
    assignNickname: assign(({ event }) => {
      assertEvent(event, 'CREATE_GAME');
      return {
        nickname: event.nickname,
      };
    }),
    assignGameId: assign((_, params: { gameId: string }) => {
      return {
        gameId: params.gameId,
      };
    }),
    assignNicknameAndGameId: assign(({ event }) => {
      assertEvent(event, 'JOIN_GAME');
      return {
        gameId: event.gameId,
        nickname: event.nickname,
      };
    }),
    assignGameState: assign(({ event }) => {
      assertEvent(event, 'GAME_STATE_MESSAGE');
      return {
        game: event.gameState,
      };
    }),
    setConnectToGameToTrue: assign(() => ({
      websocketShouldBeConnected: true,
    })),
    setGameJoinedToTrue: assign(() => ({
      gameJoined: true,
    })),
    resetContext: assign(() => defaultContext),
  },
  guards: {},
  actors: {
    createGame: fromPromise<string>(() => {
      throw new Error('Not implemented');
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgFEAlCgeQoH0BZMgZWYEEBxMgbQAYBdRKAAOAe1i4ALrlH4hIAB6IArAHYANCACeiAEwAWXgDp9ANgCMqgJz7dvVadXLTAXxea0WPIVIUWZABU+QSQQMQlpWXklBDVNHQRzAA5lEwtrW3tHZzcPDBwCYhIAYQAJNgDGFnYuYPlwqRk5UJirOyMk3STeXiTzU15TK1V9eMQkq2NeXRsAZhHlXjVdc1yQTwKfEg42JjpmAIqyKtZOHgF68UaolsRzc2UrIwX+voNB-VmxhAmko11TLNlN0Hsp9OYVmsNt4ijs9gApagASQAcmQACJ1UINSLNUAxcz6VTmIy8cGzJIOVTU+6mb4TWZGRazKxJIm6Wb9B5Q-IwohGCC4WCYWSETCSSAlPxHOhw84hERXXHRRBEp7DTkc+zKTlA0baRBA4xWCGqWamXROWw5dzrXmFfmC4WisDiyWI1Gy3byy4RJoqhBqowaiGzbW6sHffT6VKWZLOeZvSauW3Qh1GTAAJzA6Gk+CgHHQqDAJAgsjARgIADdRABrCtZnMSwvFrGKv03fF3XgPIyAwY6+4sgffGZ-HsrOxk5SW5SrVP2nwZ7O5ggFoslsCZzOiTNGYQAG1zADNd6hl02wC2wG2wkr-bdYiy0iMw9YybNZrpvmH9H21LwVhDACSRAqoPJeOmABWogEGu14kAA6mQABCzDUMUADSgR0MU1AomixSVJQNAULeOIPl2iQ9qk-amIO5jDvR3yWKk0aAaYZhtPcAIpnkkFLjBcH5ghZRsCiXDonQATUHQAAy1AoShACa5H3p2ih3I8TxqBS9zKDOPasj+KxMuYkxOPMYJmuBC4CcQRhCfg8EbiU5QSRi0myQACnJbDKZQzB0IhFBIgEqIcMFtDoswakdnimmJIYfyMdYiycUMqjfgagagR0-Q0kB9yDLZ-GbA5TkucWbniZJXl0L5-mBfsACqKEMGF4USVFFCYhc2LqQlBKWKoTJmqY9ETUkFhJEk3zAk8hi0vYPFmHxdr2fyB6iAARjtWg1R5UkyQ1fkBRQQUhWFEU9TFcXXENdzEotDhst03TWMkUa9EyX76FY3GsuC61pkuh7oFoW6wIhmaNPmiG7hAsCHXVJ2NedQXMG1HUBF1kWIdF93Ko+liAc8YaAoSIEDHSOXLMGAw6taEJkm4tr4KIEBwPIoPEL6D0BlY9KjTYgFqKovDDqBpUbeVjpCiK+BihKED88TVEGH8ziTLSgLUo4LHUqSsz-ZylK6JOugQXLF6riJG5q5RiVZSSYGAnpcb3KOVipM46QWDGBkTdbfKObBzn28WjsaQSnJTNaC2ftp5je+OE2WAHBl+yH6bbXtCTtgLJMpKNFJhgZtgW3OKc5V+fycW9jGccCyQ52DR6Q5m0Ow3mUAI5mSPR49iQgn20avWLs1RnlfSmJS5iSxbMZW3ZNvg53sDMGA+CCvDiPMAArjtqBChIGkUTHT2PB0Pa9BMnz-Yx3wN0YpOLIMKSsg4bMuEAA */
  context: defaultContext,
  initial: 'disconnected',
  on: {
    ERROR_MESSAGE: {
      target: '.disconnected',
    },
    RESET: {
      target: '.disconnected',
    },
    GAME_JOINED: {
      actions: 'setGameJoinedToTrue',
    },
  },
  states: {
    disconnected: {
      entry: 'resetContext',
      on: {
        CREATE_GAME: {
          target: 'creatingGame',
          actions: 'assignNickname',
        },
        JOIN_GAME: {
          target: 'joiningGame',
          actions: 'assignNicknameAndGameId',
        },
      },
    },
    creatingGame: {
      invoke: {
        src: 'createGame',
        id: 'createGame',
        onDone: {
          target: 'joiningGame',
          actions: [
            {
              type: 'assignGameId',
              params: ({ event }) => ({ gameId: event.output }),
            },
          ],
        },
        onError: 'disconnected',
      },
    },
    joiningGame: {
      entry: 'setConnectToGameToTrue',
      on: {
        WEBSOCKET_CONNECT_ERROR: 'disconnected',
        GAME_STATE_MESSAGE: {
          actions: 'assignGameState',
          target: 'game',
        },
      },
    },
    game: {
      on: {
        GAME_STATE_MESSAGE: {
          actions: 'assignGameState',
          target: 'game',
        },
      },
    },
  },
});

export default gameFsm;
