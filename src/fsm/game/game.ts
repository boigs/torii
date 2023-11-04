'use client';

import { assign, createMachine } from 'xstate';

import config from 'src/config';
import { Player } from 'src/domain';
import { GameState, WsMessageIn, WsTypeIn } from 'src/websocket/in';

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

type WebsocketMessageEvent = {
  type: 'WEBSOCKET_MESSAGE';
  value: {
    message: WsMessageIn;
  };
};

type WebsocketConnectErrorEvent = {
  type: 'WEBSOCKET_CONNECT_ERROR';
};

type ResetEvent = {
  type: 'RESET';
};

type Context = {
  gameId: string;
  nickname: string;
  players: Player[];
  websocketShouldBeConnected: boolean;
  gameJoined: boolean;
};

const defaultContext: Context = {
  gameId: '',
  nickname: '',
  players: [],
  websocketShouldBeConnected: false,
  gameJoined: false,
};

const createGame: () => Promise<string> = () =>
  fetch(`${config.headcrabHttpBaseUrl}/game`, { method: 'POST' })
    .then((response) => response.json())
    .then((response) => (response as { id: string }).id);

const gameFsm = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoIEtYGMB7AO2LHwBdIBiAYQCUBRAQQBVGB9AcWYFlGA2gAYAuolAAHQrBwUcJcSAAeiAOwA2AIyZVAJgCsmzboDMAFl3qNADgA0IAJ6J9J-Zk379Q60I0H1AJyqAL7B9qgY2HhEpORUENQAUgDyAJIActx8gqKKUjJyCkjKzt6YWgHGqhpCAUK6GvZOCGZCZpi1WpqqFtZmZgFmoeHoWPgATmAocsRQXKPUECRYOMQAboQA1lgRY5PTq3OjCKsb+AckwiJXedKy8sSKKgj6qtommmYmQSau6roBXRNZyWTDWcy6TT1X6aayQ4YgXaYCZTGZHDDUMDjcaEcaYCQAG2mADNcWhMEiUQdZvMMCd1oRzoViFcbsV8vciqBnuDVDp9NZ1OYrIKLEDHIghXzuoLKroBvp1PUEUiAFaEVaHWlgagAdUYACEAMrJWgAaUYrA4tGS6XSjFoVsY9HoyXobMkd2ZT0QJiEQkwFleJlUAWsnjqAWBCFcfNavy8fTM+la+hVo0w6s1NIW+uNpotVv4RqNzC4OTE7K9Dx9CAAtFD2t1PqoBVprMZoynrJgPr49KoYXDNOnIlniFrc4aTebLRxi6XywJNJXPQUa8VnnXzL3IbVqmZ1ODYZpo4eAph9PKrAZNL8BofR1gCYQAEavhx66cFucLssV251y5Ep63UMxtEPRVwKEFw6ksaMwIDcDBWMa91AFIYwkRDMX3fT88xnQt50YEt-2XVcQA5b1N0QOtDxMdx5W+SxTE+AITDPQJL2vPRDHvQZQiw4hCAgOBFF2QDOUeGjQOsC9ILAqFYPqdRo0hdRL1DT5jDhLQtF0J8ogIEgyEoSBJOo7lEA7dpdGvPsvAacFoz9dpfEqL5AThaxVF8QyqTRbULI3KyEEHbRqhgq8QyFXToz0BilV8sN1C0AVdGsQzx0nDBguA5540wdiPH6TRAnlawfK7Mwez7aoGiHeEsKRXCPzy6TQu3YxuMGSwhWML4PGq3RyjDVpKv6JU-MEoA */
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
        | WebsocketMessageEvent,
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
      RESET: {
        target: 'disconnected',
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
          WEBSOCKET_MESSAGE: [
            {
              target: 'lobby',
              cond: 'isGameStateMessage',
              actions: 'assignPlayers',
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
          GAME_JOINED: {
            actions: 'setGameJoinedToTrue',
          },
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
      setConnectToGameToTrue: assign(() => ({
        websocketShouldBeConnected: true,
      })),
      setGameJoinedToTrue: assign(() => ({
        gameJoined: true,
      })),
      resetContext: assign(() => defaultContext),
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
        event.value.message.type === WsTypeIn.GameState,
      isErrorMessage: (_, event) => event.value.message.type === WsTypeIn.Error,
    },
  }
);

export default gameFsm;
