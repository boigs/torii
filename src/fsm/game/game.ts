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
  message: HeadcrabError;
}

interface ChatMessageEvent {
  type: 'CHAT_MESSAGE';
  message: ChatMessage;
}

interface GameStateMessageEvent {
  type: 'GAME_STATE_MESSAGE';
  message: GameState;
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
      const { players, rounds, state } = event.message;
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
      const { sender, content } = event.message;
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
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgFEAlCgeQoH0BZMgZWYEEBxMgbQAYBdRKAAOAe1i4ALrlH4hIAB6IArAHYANCACeiAEwAWXgDp9ANgCMqgJz7dvVadXLTAXxea0WPIVIUWZABU+QSQQMQlpWXklBDVNHQRzAA5lEwtrW3tHZzcPDBwCYhIAYQAJNgDGFnYuYPlwqRk5UJibcyNeXStlZSTTU15HeMQk3na1K10AZlV9KbtTZVyQTwKfEg42JjpmAIqyKtZOHgF68UaolsRzXWV9I1upqf0781MklKThhFUPjqdnKZDOlVOZlqtvMQjBBcLBMLJCJhJJASn59nRNkw6qEGpFmqAYvprEYrKopjcpvZlOSpndvrTjFYbmTTLonLYcu4VvlIURobD4fhEciICQAFLUACSADkMVsTiEROc8dFEESrCSyRSqTS6do1S8jJZks4ZkkblZBuCeYU+ZgAE5gdDSfBQDjoVBgEgQWRgIwEABuogA1n6HU7ke7PdilREmqrEmNUqZKYtyeYppbFt8ukkOjcbrxeC82cowVyIbajOHnQQ3R6vWB7fbRPajMIADbOgBmrdQ1cdzrAUbAMbCyvjV1imbSs0p1mLT109OLRkWql4VlMk3etNU1q8VYAVqICHWRyQAOpkABCzGoxQA0oE6MVqNLpWRipVKDQKGPcUnAlriTNdU2pcwMyzZRvksVJ9EMLczEmSDdH6A81ihE8z1dC8yjYaUuAAEToAJqDoAAZagbxvABNACJ0uYDEmUKwNTUKZzXMHo7HMKwvn1BB5nGPidXZMl9wrG0fCMbD8HPBsSnKQiyBIsi6AABQothaMoZg6EvChJQCGUOAM2giOYBi4yYxRrkMPMM2sZRBmQ1Rl0E-QkimIxzUcUEt0gwZJLyQ8ZLkhTPSUgjiNI8itJ0vSdgAVRvBhjJMwjzIoIjrIufE7MSSxVCMDj+kBPpkgEhJeg1QxIIGUEbjMVwpLCqEO1EAAjLqtA2eU6AlGVVLylUpz43RdAeUYNzUMZunNHMiweFzLV4Pp3iJakMN5IxOp6vr8JUtT4u03SKH0wzjNM7LLNGoDCuNOqHCSLz1vsJlqrVdbSvmfQ2N0PjXreHaq07dAtCbWBL3tRpXUvVsIFgfrtiGz9ctOHFGIKmI7EmownCec1dBSVRfg8hJ-vaNl1v0bjDFsFJQZk8HIftaHYZdKAEftJHouOuLNLOpLmFS9KAkyszLws+7bJiSxNwJ1NyVsd4BlMb41CmrdeGpDlC30ZmoVZqHmDAfAYXhxHmAAVy61BYQkWQUYONGRsx2N8oTOxflK5wXreRxzF4KZvlBeDWWeMt5jJ943C5fBRAgOB5ErHwzhsnHECsb4khKmxN2JqxOIcWwjb5GE4QRMAkUgDOvanAw82cS0GpTWONEE4qOmeYvkncwHJvLgcI0isB67G5j3PaPcU04yCmvMHNulK-pLAsF4enQtrML5CLcIbCeHvl8ljGLW5aqeVimWXvNBnSDeekBYf9t6o+5euUmjE4ykelsSayxL0EvMPMQJXrmimECXoyRh4m3ZjDOG3NEbwCxpnBMyQxhrgQi9TcvQvoIC8j5Pyedg7zAMMoXQsCuxs1gGbC2dYeYQFtvbR2D1AIf0SE4DUoxg4fBsL3DM3wwFGlmkWd4rE86tTcEAA */
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
        CHANGED_TO_PLAYERS_WRITING_WORDS: 'playersWritingWords',
        CHANGED_TO_PLAYERS_SUBMITTING_WORD: 'playersSendingWordSubmission',
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
        GAME_JOINED: {
          actions: 'setGameJoinedToTrue',
        },
        CHANGED_TO_PLAYERS_SUBMITTING_WORD: {
          target: 'playersSendingWordSubmission',
        },
      },
    },
    playersSendingWordSubmission: {
      on: {
        GAME_JOINED: {
          actions: 'setGameJoinedToTrue',
        },
      },
    },
  },
});

export default gameFsm;
