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
};

const createGame: () => Promise<string> = () =>
  fetch(`${config.headcrabHttpBaseUrl}/game`, { method: 'POST' })
    .then((response) => response.json())
    .then((response) => (response as { id: string }).id);

const gameFsm = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGIBKBRAyrgCoDaADALqKgAOA9rAJYAujdAdtSAB6IAcAZj4A6MmQCsfAJziAjADYATAHZ5sqQBoQAT0SKyIgQBYBU2SakCBZBeIC+dragzCIjWAGMO7MB+aRMAGE8AEEiXAB9AHEQgFlcciokEHomVg4uXgRVWWFlRTlZRWNFeVU+LV0EcQFxYVlxcQMyVQL5KWUHJ3QwV3cvdh8-AIApAHkASQA5aLiEyi5UljZOZKymkTUzFVUyKTIVeUrEIzIjUSk1WWUjRT4jIykjLpBnXo8AJzAUVnYoKJ6mAgHF6jHYADc6ABrXpvYSfb6-f49BBgyEeH4rRKJRYMZYZNaIcTKXICcymZRWcRKKSKY7VUrCQS3WQHKyyPiKWQvOEIzF-AEYTBgD4fOgfYQ0AA2PwAZuK0MJeV9+ciMKiIXQMel2NiFskljrMvwBMo8pJ5MYynx5Lc6TpEJazdcbdtHtSDjyesIAFZ0MFgtVYADquAAQvgxoEANLECKBMZTKa4QJECK4bDYMbYHEGvFGwkIaxkYS3YmmqR8Rr7TQOovE0tkKkGB7iU72Ryvb1+gMCwGhiNR2Np+L4fAhKLzJK0fMrY0IAC0rPO13MygtHKK9LbhlZynylLJnO5nbhPfYgcFIfDkZjcdH48nJFk05Ss4JoCyC+MwgEXL2+5GPIgibvSQFSMI4iKEB+RyFYjxAV6LhSnQABGqHaJgA63sOEQPhOU64mkc6Fgutq5EB1JGKyNT7KU9K2iW1E2kU0HyPIkjPKe3ooehmHYUO94EI+CQvkR+KrJ+iALkBAj1NBpilMU5iWGB7SQWxsGyPBTwOJ27B0BAcBcG84kFlJi7ARBlHkRIpgHEcdZFCW9ymLIDTLpcMhIb0bieN4vj+BAZkkRZfDmMIihsWSEgHMogj0tY5wtGYFh3HcygtD58IqkiV4hR+PCIJSuT7hIUGmpanKOVU+RyfILR7DaaiSHc2XnpePQFZJRUIKccmWA0DwKLSRh8HwyjbmNv57ge7LHtlvEYd187fkUGlPKUlpFCYDRTYowjtPcBj3EBYidHpQA */
    id: 'game',
    predictableActionArguments: true,
    tsTypes: {} as import('./game.typegen').Typegen0,
    schema: {
      events: {} as
        | CreateGameEvent
        | JoinGameEvent
        | WebsocketConnectErrorEvent
        | WebsocketMessageEvent
        | ResetEvent,
      context: {} as Context,
      services: {} as {
        createGame: {
          data: { gameId: string };
        };
      },
    },
    context: {
      gameId: '',
      nickname: '',
      players: [],
    },
    initial: 'disconnected',
    on: {
      RESET: 'disconnected',
    },
    states: {
      disconnected: {
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
        event.value.message.type === WsTypeIn.GameState,
      isErrorMessage: (_, event) => event.value.message.type === WsTypeIn.Error,
    },
  }
);

export default gameFsm;
