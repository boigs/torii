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

const createGame: () => Promise<string> = () =>
  fetch(`${config.headcrabHttpBaseUrl}/game`, { method: 'POST' })
    .then((response) => response.json())
    .then((response) => (response as { id: string }).id);

const gameFsm = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoIEtYGMB7AO2LHwBdIBiAYQCUBRAQQBVGB9AcWYFlGA2gAYAuolAAHQrBwUcJcSAAeiAEwB2dZgAsAVgBsADlWHtQgMzb1Q-QBoQATzXnMARn2Whp7eYCcq1R8AXyD7VAxsPCJScioIagApAHkASQA5bj5BUUUpGTkFJGVEK11MX1dzQyqPD3VzVXsnBHVVTED1bX1tQ2qhIV11QxCw9Cx8ACcwFDliKC4x6ggSLBxiADdCAGsscPGpmbX5sYQ1zfxDkmERa9zpWXliRRUEVV02oVdXQyFfKsrDL5fIYmohLK5MOYhKpuup9EZdH4hOoRiA9phJtNZscMNQwBMJoQJpgJAAbGYAMyJaEw6MxhzmCwwpw2hAuBWI11uRTyD0KoBeum0mF0hk0qj+GgC+l86lBCH0bQ02lcA0MlV8PR6qPRACtCGsjkywNQAOqMABCAGUkrQANKMVgcfhWq3MLjZMQ8+4c56IdSuYW6fxVLy6ZH+OWORBCTCaFVmOHGVxwirmHVjTD6w2Mxbm622h1Ol1uj0CVxeyQ+x5+hWqCGmcyuXRfbQaMXmeUAWl8scs9YCP1FKd8ugzEWzxCNectNvtjo4tCSaTSjFoTsY9HoSXo3Kr+RrRReAZcAXMg2Dv2+ul08rb+nKb375nUf3eqnToTRmdJhAARn+DhmrOhYLiW7qencB78sUCC9GU4YGJqTb6F81TyjCEKuB+3z6K+-iih445YL+AFAfmc5Fs6jCuhB5aViAvK+keiCAi4-jfBxOHBiC0YINhEL9CY3yfE2fjvCEX7EIQEBwIoexQXyTwsQqIpiq0kqtDCvh4d2KZaKY9YWOoBitNo2jEZEBAkGQlCQIpzECmCXSYL0KoNMiqheIE3YyuUOmVBq5moQEln0tixoOYeTmvMGkKdEMeGBj4Kq3nxKYPjKwauBUAYGA0lmTtOGBRTBgqqq5VTnl0pkVGlzRQi46pfH8PSBqKFlfuipGAaVykxQGhhuFq+hCHoyKdK48o5S4litCmL5vmeklBEAA */
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
      services: {} as {
        createGame: {
          data: { gameId: string };
        };
      },
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
            actions: 'assignNickname',
          },
          JOIN_GAME: {
            target: 'joiningGame',
            actions: ['assignNicknameAndGameId'],
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
        on: {
          WEBSOCKET_MESSAGE: [
            {
              cond: 'isGameStateMessage',
              target: 'lobby',
              actions: 'assignPlayers',
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
              cond: 'isGameStateMessage',
              actions: 'assignPlayers',
            },
            {
              cond: 'isErrorMessage',
              target: 'disconnected',
            },
          ],
        },
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
      assignPlayers: assign((_, event) => {
        const { players } = event.value.message as GameState;
        return {
          players,
        };
      }),
    },
    services: {
      createGame: async () => {
        const gameId = await createGame();
        return {
          gameId,
        };
      },
    },
    guards: {
      isGameStateMessage: (_, event) =>
        event.value.message.type === WsType.GameState,
      isErrorMessage: (_, event) => event.value.message.type === WsType.Error,
    },
  }
);

export default gameFsm;
