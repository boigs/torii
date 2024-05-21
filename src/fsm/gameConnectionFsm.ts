import { assertEvent, assign, fromPromise, setup } from 'xstate';

interface CreateGameEvent {
  type: 'CREATE_GAME';
  nickname: string;
}

interface JoinGameEvent {
  type: 'JOIN_GAME';
  gameId: string;
  nickname: string;
}

interface JoinGameSuccessEvent {
  type: 'JOIN_GAME_SUCCESS';
}

interface GameConnectionErrorEvent {
  type: 'GAME_CONNECTION_ERROR';
}

interface ResetEvent {
  type: 'RESET';
}

interface GameJoinedEvent {
  type: 'GAME_JOINED';
}

interface Context {
  gameId: string;
  nickname: string;
  connect: boolean;
  gameJoined: boolean;
}

const defaultContext: Context = {
  gameId: '',
  nickname: '',
  connect: false,
  gameJoined: false,
};

const gameConnectionFsm = setup({
  types: {} as {
    context: Context;
    events:
      | CreateGameEvent
      | JoinGameEvent
      | JoinGameSuccessEvent
      | GameConnectionErrorEvent
      | GameJoinedEvent
      | ResetEvent;
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
    setConnectToGameToTrue: assign(() => ({
      connect: true,
    })),
    setGameJoinedToTrue: assign(() => ({
      gameJoined: true,
    })),
    resetContext: assign(() => defaultContext),
  },
  actors: {
    createGame: fromPromise<string>(() => {
      throw new Error('Not implemented');
    }),
  },
  guards: {},
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgFEAlCgeQoH0BZMgZWYEEBxMgbQAYBdRKAAOAe1i4ALrlH4hIAB6IArAHYANCACeiAEwAWXgDp9ANgCMqgJz7dvVadXLTAXxea0WPIVIUWZABU+QSQQMQlpWXklBDVNHQRzAA5lEwtrW3tHZzcPDBwCYhIONiY6AClqAEkAOTIAEWD5cKkZOVCY831VY1Mk6wBmU11lK10rAfjEJImjXmVbcytTXl5dAeVdXJBPAp8jCFxYTFlCTElIEgBhPzYAsjoSpibQlsj20BjuqyMrVQHzOt7MoARt9FMEBtjFZAf9hk5bDl3Dt8t5iAcjid8GcLhASJVao9SjwBM1xK0oh1EN9fv9AQNgaCFhD9PpUpZks4BqokoCrLxXMjdmiiEZMAAnMDoaT4KAcdCoMAkCCyMBGAgAN1EAGs1RKpRd5YqXiJye9oohzLxzKlTAzTCDzOYBvyHRDxkk5oDAas2bonOZtsLCqL9dKCHKFUqwOLxaJxUZhAAbaUAM3jqDFkulYCNYBNYTNbQtsRdaVU+gZ1l4lYGughDP0RgdPWWYz6G1UQdRIaMACtRAQI3mSAB1MgAIWY1CuAGlAnQrtQanUrgE6JQaBQC29i1TEtbbfbHc7XcoIZZUqzeMszGMnbpTIK8l5ewOh7KR08HswAncHkwrCcCSISmhEe6gAkHpzE+lgWGyyjOKYmidH0uhGNyCystkPJPt2r77FAUbFMSdC-v+jAsOwXA7kWlKfHoApGM6ui8iMDbWkYqiAroIyPkkZh4ds+CiBAcDyMGPhkuB9GKIgAC0+hJBCSSeiMMIjAsTh9EiL57OihzHKcYDnJA0kUh8ckIAYnrOPyTpPtyDgaNolqqKocwDPoEzJKovE8fh+mhtmMqRoq5nmvufnmBhah2gMvIck67pWKkSFwV0iFIYFIr9oO+DDlGEUQVZzpWnMiLKDMAwbFYMIpZ6ArpPBWVCXpuVEeFrx0ZZMS8BCCwxRyKR2jyfKBm4LhAA */
  context: defaultContext,
  initial: 'disconnected',
  on: {
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
        JOIN_GAME_SUCCESS: 'game',
        GAME_CONNECTION_ERROR: 'disconnected',
      },
    },
    game: {},
  },
});

export default gameConnectionFsm;
