'use client';

import { assign, createMachine } from 'xstate';

import { Player, Round } from 'src/domain';
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

type ChatMessage = {
  sender: string;
  content: string;
};

type Context = {
  gameId: string;
  nickname: string;
  players: Player[];
  rounds: Round[];
  websocketShouldBeConnected: boolean;
  gameJoined: boolean;
  messages: ChatMessage[];
};

const defaultContext: Context = {
  gameId: '',
  nickname: '',
  players: [],
  rounds: [],
  websocketShouldBeConnected: false,
  gameJoined: false,
  messages: [],
};

const gameFsm = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGIBKBRAyrgCoDaADALqKgAOA9rAJYAujdAdtSAB6IAcAVgCMAOgAsYsgGYAbFLFShAThkAmGQBoQAT0RC+UkXzF9VUxUtkB2AL42tqDCIiNYAYw7swb5pEwBhPABBIlwAfQBxIIBZXHIqJBB6JlYOLl4EKxlRK1VhITMxdSy+LV0EASkBESEBATI+Miy8mSVbexBHMGdXD3YvHz8AKQB5AEkAOUiYuMouZJY2TkSM4VUjOqsxKyFpVSVSnUQisREZOolGsSFc5XaHdG63ACcwFFZ2KAjHzAgObsY7AAbnQANbdLoiF5vD5fR4IQEgtzvJbxeLzBiLNIrRACHYiRQKNrmARqJSqMq49RGeSqXZmRSmIR2B5OaEoz7fDCYMDPZ50Z4iGgAG3eADMBWgRJD2bCuWAEcC6MjUuw0XNEgtVel+FIrCIrAI+HIxDIrMaihSjgg5PqbsalAUxEpSWRVCzOo8RAArOiAwFw7kAdVwACF8CN-ABpYhhfwjCYTXD+IhhXDYbAjbDozWY7U4hCqAwiSqOopCbImOpSSkIKSqfV4pQNVRFukGdQeyG+-2cn4h8ORmOp2L4fBBCKzBK0PNLHUIAC0bRElkEMj4Vks8nkYlrYkqBJMan0MnOerEXa9PfYAflmAHEejsdH48nJCE06Ss+xoAyC5kpwFHSpobsYbRWDW1pFGQNQ3JIEFmmYbqXk4wp0AARuh2j3mGj7DmEL4TlOGIpHOBb-io4gWGQKg7KefCHOUtorsIVR8G0Z5KCh3RoZh2EPkOz4EK+cQfiRWLLL+iALrsghnA2Bwbgo0i1nI6xkPoZhkmQZAgdxIi8VhmBRLEYSjJMuAACI5jOpE-jw0l0oYigAc2VhbGQMjSJo1rMS6QhsRxpb6YZ-G4YJI7CURJCqJ+WpkVJi6tKcNEHK0dSNAptY7IYpp5GYdT6LIF4euwdAQHAXBdOJ+aJTJAWGGom4MVsUgqdalHyKYqWCAFpoyPpLjuJ43i+BANUJQ5CB8EIpytqaihkPUDYGLWbUpZus1SOSpgbk0+myrejwTfZGQQTkVhLQIZhZFIpg+eUuSNU0NHGtkRpFvp15HRgJ2SVN+zVLNZqyHUlSKEIqmkgS5zOi6DHbftHSQqFf3zguiiNux1y5GY5K5LWGU1Jjs0Vrs11cXYNhAA */
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
              cond: 'isGameStateMessageOnLobby',
              actions: 'assignGameState',
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
              cond: 'isChatMessage',
              actions: 'addChatMessage',
            },
            {
              cond: 'isGameStateMessageOnLobby',
              actions: 'assignGameState',
            },
            {
              cond: 'isGameStateMessageOnPlayersWritingWords',
              actions: 'assignGameState',
              target: 'playersWritingWords',
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
      playersWritingWords: {
        on: {
          WEBSOCKET_MESSAGE: [
            {
              cond: 'isChatMessage',
              actions: 'addChatMessage',
            },
            {
              cond: 'isGameStateMessageOnPlayersWritingWords',
              actions: 'assignGameState',
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
      assignGameState: assign((_, event) => {
        const { players, rounds } = event.value.message as GameState;
        return {
          players,
          rounds,
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
          messages: [{ sender, content }, ...context.messages],
        };
      }),
    },
    guards: {
      isGameStateMessageOnLobby: (_, event) =>
        event.value.message.kind === WsTypeIn.GameState &&
        (event.value.message as GameState).state === 'Lobby',
      isGameStateMessageOnPlayersWritingWords: (_, event) =>
        event.value.message.kind === WsTypeIn.GameState &&
        (event.value.message as GameState).state === 'PlayersWritingWords',
      isErrorMessage: (_, event) => event.value.message.kind === WsTypeIn.Error,
      isChatMessage: (_, event) =>
        event.value.message.kind === WsTypeIn.ChatText,
    },
  }
);

export default gameFsm;
