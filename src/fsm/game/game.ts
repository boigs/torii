'use client';

import { assign, createMachine } from 'xstate';

import { Player, Round } from 'src/domain';
import {
  ChatMessage,
  GameState,
  HeadcrabError,
  HeadcrabState,
} from 'src/websocket/in';

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

type GameJoinedEvent = {
  type: 'GAME_JOINED';
};

type ErrorMessageEvent = {
  type: 'ERROR_MESSAGE';
  value: {
    message: HeadcrabError;
  };
};

type ChatMessageEvent = {
  type: 'CHAT_MESSAGE';
  value: {
    message: ChatMessage;
  };
};

type GameStateMessageEvent = {
  type: 'GAME_STATE_MESSAGE';
  value: {
    message: GameState;
  };
};

type WebsocketConnectErrorEvent = {
  type: 'WEBSOCKET_CONNECT_ERROR';
};

type ResetEvent = {
  type: 'RESET';
};

type ChangedToLobby = {
  type: 'CHANGED_TO_LOBBY';
};

type ChangedToPlayersWritingWords = {
  type: 'CHANGED_TO_PLAYERS_WRITING_WORDS';
};

type Context = {
  gameId: string;
  nickname: string;
  players: Player[];
  rounds: Round[];
  websocketShouldBeConnected: boolean;
  gameJoined: boolean;
  messages: ChatMessage[];
  headcrabState?: HeadcrabState;
};

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

const gameFsm = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGICiAlXA8rgPoCy2AyhQIIDi2A2gAwC6ioADgPawCWALry4A7diACeiALQAOAOwA6AKwAaEAA9EARi0A2RVoDMTGTK1MlTAExyZhgL721qDJlyVsAFWZskIbnyCImKaCDJKWgoALFFMhrqGUYZaAJy6VrpqkghadgoyUTJWhskp8XKOzuhYAMIAEtSeZJQ09D5iAQJCon7ZUlpyqhrallEKTHK6qYZKljZ2lSAuWLTU5MQUno3YzVR0jKwdPF3BfqFaUYMKyRZWWjZxMVnSMgq6ukwpSnJ6l19RKUWywUEF4sAAxiJhGBwfxIJgau5tsRVuR2n5OkEeqBQpNInIrBF7okMpMZM8EEoZgotLMTBN0kpdCkKk4ltUQWDIcJobD4QApAgASQAcii1gdfJxjliQogIlZ8rM5JdzIYrClyRJEFErGNdLMYjImFEBncWUCOeCAE5gFCCYRQWjVTAQERgBS8YQANy4AGsPcCbXaHU7qggvb7wfbuj50dLAt05ZSftcLoYWSUmRqrBSlBl8iTzMVkkUtJaMApgzHHc7XGBrdauNaFBwADb2gBmzbQCiDtprYYwEZ9XGjWLjhwxMqTZ0QdkUgxkCSi+mXutz2oQCQMtmZ9wBTOsFY9ACsuF6vUOsAB1bAAIQoBBqAGkvMQagQRSLsDUmnhCFweN-BnU4cUQKw8ipFILjuKZClmQwKXVRRvhSEwrEgu47AyE8FHPS9axdepqBFegABFiE8AhiAAGQIe97wATWAzFZ3A7djXGApigNRDkgpOxDBpCZPmXKYlCKGQ8LbLgACM5PETBUR2QVRWwcjWNA7FhgQKRV1eOQmCmOILDiORDDkCldX1Q1ChNM1UlZKpK1khSlJIsiNKomiAAVaOoJi8AoYgb1wIVPFFWhQqIciKC0xMwN0-omEiSDSl0AFBhmYyKX0FJ8j4mY9BSJIYMcNlhC4CA4DEZYjkSnTQikCJdAUIyTOMSxLMsil+iuJhBsGqlCTkNI0jw0EIShGE4QgBqTia+cLgUTDVxuOZbCQrdjDGCYYLKrD5AmPDq1DOswAW2U5wQCz8SM2ZikmQwikyLcCWEj4jM1d5aSkvCCOEK8Lqu9jdI1JQaVXCy+KpZItDyplrgNAEvlMDMTrZYE3MU0Gkua5JUJkUqzWKFIbE3bJZleIwBguPRzHzQEsY5dsUHEBtYBva0ukdG9mwgeBp0a5MpEJ5RidNAkyYpikYMhr6xN+yTIIq+wgA */
    id: 'game',
    predictableActionArguments: true,
    tsTypes: {} as import('./game.typegen').Typegen0,
    schema: {
      events: {} as
        | CreateGameEvent
        | JoinGameEvent
        | GameJoinedEvent
        | ResetEvent
        | WebsocketConnectErrorEvent
        | ErrorMessageEvent
        | GameStateMessageEvent
        | ChatMessageEvent
        | ChangedToLobby
        | ChangedToPlayersWritingWords,
      context: {} as Context,
      services: {} as {
        createGame: {
          data: { gameId: string };
        };
      },
    },
    context: defaultContext,
    initial: 'disconnected',
    on: {
      ERROR_MESSAGE: {
        target: 'disconnected',
      },
      RESET: {
        target: 'disconnected',
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
          onDone: {
            target: 'joiningGame',
            actions: 'assignGameId',
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
        on: {},
      },
    },
  },
  {
    actions: {
      assignNickname: assign((_, event) => ({
        nickname: event.value.nickname,
      })),
      assignGameId: assign((_, event) => ({
        gameId: event.data.gameId,
      })),
      assignNicknameAndGameId: assign((_, event) => ({
        gameId: event.value.gameId,
        nickname: event.value.nickname,
      })),
      assignGameState: assign((_, event) => {
        const { players, rounds, state } = event.value.message as GameState;
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
      addChatMessage: assign((context, event) => {
        const { sender, content } = event.value.message as ChatMessage;
        return {
          messages: [...context.messages, { sender, content }],
        };
      }),
    },
    guards: {},
  }
);

export default gameFsm;
