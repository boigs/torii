'use client';

import { assertEvent, assign, fromPromise, setup } from 'xstate';

import { Player, Round } from 'src/domain';
import {
  ChatMessage,
  GameState,
  HeadcrabError,
  HeadcrabState,
} from 'src/websocket/in';

interface CreateGameEvent {
  type: 'CREATE_GAME';
  value: {
    nickname: string;
  };
}

interface JoinGameEvent {
  type: 'JOIN_GAME';
  value: {
    gameId: string;
    nickname: string;
  };
}

interface GameJoinedEvent {
  type: 'GAME_JOINED';
}

interface ErrorMessageEvent {
  type: 'ERROR_MESSAGE';
  value: {
    message: HeadcrabError;
  };
}

interface ChatMessageEvent {
  type: 'CHAT_MESSAGE';
  value: {
    message: ChatMessage;
  };
}

interface GameStateMessageEvent {
  type: 'GAME_STATE_MESSAGE';
  value: {
    message: GameState;
  };
}

interface WebsocketConnectErrorEvent {
  type: 'WEBSOCKET_CONNECT_ERROR';
}

interface ResetEvent {
  type: 'RESET';
}

interface ChangedToLobby {
  type: 'CHANGED_TO_LOBBY';
}

interface ChangedToPlayersWritingWords {
  type: 'CHANGED_TO_PLAYERS_WRITING_WORDS';
}

interface ChangedToPlayersSubmittingWord {
  type: 'CHANGED_TO_PLAYERS_SUBMITTING_WORD';
}

interface Context {
  gameId: string;
  nickname: string;
  players: Player[];
  rounds: Round[];
  websocketShouldBeConnected: boolean;
  gameJoined: boolean;
  messages: ChatMessage[];
  headcrabState?: HeadcrabState;
}

const defaultContext: Context = {
  gameId: '',
  nickname: '',
  players: [],
  rounds: [],
  websocketShouldBeConnected: false,
  gameJoined: false,
  messages: [],
  headcrabState: undefined,
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
      | GameStateMessageEvent
      | ChatMessageEvent
      | ChangedToLobby
      | ChangedToPlayersWritingWords
      | ChangedToPlayersSubmittingWord;
  },
  actions: {
    assignNickname: assign(({ event }) => {
      assertEvent(event, 'CREATE_GAME');
      return {
        nickname: event.value.nickname,
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
        gameId: event.value.gameId,
        nickname: event.value.nickname,
      };
    }),
    assignGameState: assign(({ event }) => {
      assertEvent(event, 'GAME_STATE_MESSAGE');
      const { players, rounds, state } = event.value.message;
      return {
        players,
        rounds,
        headcrabState: state,
      };
    }),
    setConnectToGameToTrue: assign(() => ({
      websocketShouldBeConnected: true,
    })),
    setGameJoinedToTrue: assign(() => ({
      gameJoined: true,
    })),
    resetContext: assign(() => defaultContext),
    addChatMessage: assign(({ context, event }) => {
      assertEvent(event, 'CHAT_MESSAGE');
      const { sender, content } = event.value.message;
      return {
        messages: [...context.messages, { sender, content }],
      };
    }),
  },
  guards: {},
  actors: {
    createGame: fromPromise<string>(() => {
      throw new Error('Not implemented');
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgFEAlCgeQoH0BZMgZWYEEBxMgbQAYBdRKAAOAe1i4ALrlH4hIAB6IArAHYANCACeiAEwAWXgDp9ANgCMqgJz7dvVadXLTAXxea0WPIVIUWZABU+QSQQMQlpWXklBDVNHQRzAA5lEwtrW3tHZzcPDBwCYhIAYQAJNgDGFnYuYPlwqRk5UJjzZSTjZX1Ve2UrNSSAZn14xHNdXJBPAp8SDjYmOmYAirIq1k4eAXrxRqiWseVlcyNVJPMrc0HB3UHL-STR2NUT-UHeKwcH3iHdV3cpvlvMQjBBcLBMLJCJhJJASn5VnR5kw6qEGpFmqAYt0rEZPoNxu8nATBl0nqTjJddKpBqZqV1dDkAdNgURQeDIfhobCICQAFLUACSADkkQstiERLsMdFEDi8TTCb0SWTtHL9KlLMlnIMzuMrLx-nkvIU2ZgAE5gdDSfBQDjoVBgEgQWRgIwEABuogA1m6LVbYfbHaipREmrLErw2kZTO9TMoCVcDfGnrorEkjFHdONeLwNfTzJMWaajP7rQQ7Q6nWBzebROajMIADbWgBm9dQpct1rAQbAIbC0vDB1idzSqje9gNbxu5LzMbUH1MVj+QzURaBJYAVqICBW+yQAOpkABCzGoxQA0oE6MVqMLhWRipVKDQKAP0cOsWMo6lY4aE3MJMAKeSxUn0QwrFMMwVyAv4jUBE0fCMHc91tA8yjYYUuAAEToAJqDoAAZagTxPABND8h32b9Ej6XE1EGc42mUOwLkeNUEBuE5jgNYknG6XUNyQkEm1EAAjcStDmcU6AFEUyBwqiwxoxQxnOfQ8WSJIejYrpnFTNMjCYqxaXGCwdN+YSZlEiSpJKcpsMU-DCIABSIthyMoZg6EPChBQCEUOF82gcOYZS9kxNSEDY3FLAgpJLgGZcRk4m4MwcZc9SyfRzHjazWUbFstBrWBD3NRpbUPesIFgBysNwly6HczzvKWABVE8GACwLsJCiglO2NFqKimJGXTU5THjcwHmzbpTHJXQMqmz5zhyvLlDcAF8FECA4HkYsfB2FTRsQKwniSDNxpzcxeGpXhhgQw6QTBCEoTAGFIGOyKIwMDNnANICpt1BwNE4yxVEzYZTOSVRdGzeGCpLMsbUrR1vplEc4ZOUkHGuZiXiA1N+iMZx0gsDUjimpHkNQ-B9yrDGv2iq5bszWwjkS656PMYmM0NcmZqOMmadsySElDH6R21SGmPeI5bHh45ebSpaYweB4rmg9pklFtlm3QErzTKirUeq81aqZ1SxruQZMyuMwTIeaxFozaCkk12kNXOJI9aKw3SuYMB8DBKqauYABXcTUHBCRVM-a29CsFcjFu3LlB+Gx01ShJ0vVj3zi9nXfa2oA */
  context: defaultContext,
  initial: 'disconnected',
  on: {
    ERROR_MESSAGE: {
      target: '.disconnected',
    },
    RESET: {
      target: '.disconnected',
    },
    CHAT_MESSAGE: {
      actions: 'addChatMessage',
    },
    GAME_STATE_MESSAGE: {
      actions: 'assignGameState',
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
        CHANGED_TO_LOBBY: {
          target: 'lobby',
        },
      },
    },
    lobby: {
      on: {
        GAME_JOINED: {
          actions: 'setGameJoinedToTrue',
        },
        CHANGED_TO_PLAYERS_WRITING_WORDS: {
          target: 'playersWritingWords',
        },
      },
    },
    playersWritingWords: {
      on: {
        CHANGED_TO_PLAYERS_SUBMITTING_WORD: {
          target: 'playersSendingWordSubmission',
        },
      },
    },
    playersSendingWordSubmission: {
      on: {},
    },
  },
});

export default gameFsm;
