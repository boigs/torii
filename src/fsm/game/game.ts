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
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoIEtYGMB7AO2LHwBdIBiAYQCUBRAQQBVGB9AcWYFlGA2gAYAuolAAHQrBwUcJcSAAeiAIwA2AMwAOTACYDAdgCsx9QBZ1ATmOrtAGhABPROeN7927atOa72oUM9cwBfEMdUDGw8IlJyKghqACkAeQBJADluPkFRRSkZOQUkZTUDD209SvUDAO1NK0NHFwQDTUwg9VMfVUNtKyrNMIj0LHwAJzAUOWIoLlHqCBIsHGIAN0IAayxIscnp1bnRhFWN-AOSYREr-OlZeWJFFQQNTXaurXM9Q0tVc0MrM1EN5MMYhOChH89FZeuDtMMQLtMBMpjMjhhqGBxuNCONMBIADbTABmuLQmCRKIOs3mGBO60I5yKxCuNxKBXuxVAzw0X0wPmM5js7is1nMmiBCAaVg6AMMqg0Xh+Qnh4URo0wACtCKtDrSwNQAOqMABCAGUUrQANKMVgcWgpDIZRi0O2Mej0FL0NmSO7Mp6IAyqTDePS2L71QyaYxWcyShpCTBfRpvPSadT9eXqBFI7W6mkLY3my02u38M1m5hcXJidl+h4B1p6YOh8ODKMxuPORBdYyYHRVMMaPTgjM5jV54h6wumi3W20ccuV6sCVS132FBslZ5BkOqIcRzQd2OS8zmRMDRqBXl9YyqkZRAmEABGz6cRtnJYXS6rNdum65UoEHUQIOiEdQMz+IRNEsO9JXcdoYUMLRvjefcvnHR8XzfD9i3nMtGArX9V3XEAOX9bc1CEMF9H8GN5VUaN1FUSUII8FDKhVDRezCNViEICA4EUXZ-05R5KIQABadRJUkvsrAUhSozsHRzxMTCsFwAgSDIShIFEijuTUf4+0sJUqjMGoM3jKxdG+RpVFjPxISGNVKX2NF9QMrcjJebxdCgqMw0McFbBY7spXlTBrAsIQzzsFzXIfLBJ2nDBvMA54vklBVTOQ0w7xQs8ow0zAn1fFoNzExsAXkiwrDeKMAh6VitH5TRBy4iDTF4kIgA */
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
          WEBSOCKET_CONNECT_ERROR: 'disconnected',
          WEBSOCKET_MESSAGE: [
            {
              target: 'lobby',
              cond: 'isGameStateMessage',
            },
            {
              target: 'disconnected',
            },
          ],
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
