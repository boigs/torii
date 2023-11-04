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

const gameFsm = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGIBKBRAyrgCoDaADALqKgAOA9rAJYAujdAdtSAB6IAcAVgCMAOgAsYsgGYAbFLFShAThkAmGQBoQAT0RC+UkXzF9VUxUtkB2AL42tqDCIiNYAYw7swb5pEwBhPABBIlwAfQBxIIBZXHIqJBB6JlYOLl4EKxlRK1VhITMxdSy+LV0EASkBESEBATI+Miy8mSVbexBHMGdXD3YvHz8AKQB5AEkAOUiYuMouZJY2TkSM4VUjOqsxKyFpVSVSnUQisREZOolGsSFc5XaHdG63ACcwFFZ2KAjHzAgObsY7AAbnQANbdLoiF5vD5fR4IQEgtzvJbxeLzBiLNIrRACHYiRQKNrmARqJSqMq49RGeSqXZmRSmIR2B5OaEoz7fDCYMDPZ50Z4iGgAG3eADMBWgRJD2bCuWAEcC6MjUuw0XNEgtVel+FIrCIrAI+HIxDIrMaihSjgg5PqbsalAUxEpSWRVCzOo8RAArOiAwFw7kAdVwACF8CN-ABpYhhfwjCYTXD+IhhXDYbAjbDozWY7U4hCqAwiSqOopCbImOpSSkIKSqfV4pQNVRFukGdQeyG+-2cn4h8ORmOp2L4fBBCKzBK0PNLHUIAC0bRElkEMj4Vks8nkYlrYkqBJMan0MnOerEXa9PfYAflmAHEejsdH48nJCE06Ss+xoAyC5kpwFHSpobsYbRWDW1pFGQNQ3JIEFmmYbqXk4wp0AARuh2j3mGj7DmEL4TlOGIpHOBb-io4gWGQKg7KefCHOUtorsIVR8G0Z5KCh3RoZh2EPkOz4EK+cQfiRWLLL+iALrsghnA2Bwbgo0i1nI6xkPoZhkmQZAgdxIi8VhmBRLEYSjJMuAACI5jOpE-jw0l0oYigAc2VhbGQMjSJo1rMS6QhsRxpZ2B07B0BAcBcF04n5lJi5CAFhhqJuDFbFIKnWpR8imFUqimo6pIXh0kIuO4njeL4EAxWRcV8EIpytqaihkPUDYGLW6WnE0ZZSOSpgbk0+myrejzVfZGQQTkVgtQIZhZFIpg+eUuRJU0NHGtkRpFvp14jRgY2SQ5hYujUpoIXUlSKEIqmkgS5zOi6DG9YNxVeoZ5S2RJ84LoojbsdcuRmOSuS1nUfA1L99UVrss1cSFQA */
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
    guards: {
      isGameStateMessage: (_, event) =>
        event.value.message.type === WsTypeIn.GameState,
      isErrorMessage: (_, event) => event.value.message.type === WsTypeIn.Error,
    },
  }
);

export default gameFsm;
