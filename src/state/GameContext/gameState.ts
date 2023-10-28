import { assign, createMachine } from 'xstate';

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

type CreateGameService = {
  data: {
    gameId: string;
  };
};

type JoinGameService = {
  data: {};
};

const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoIEtYGMB7AO2LHwBdIBiAYQCUBRAQQBVGB9AcWYFlGA2gAYAuolAAHQrBwUcJcSAAeiAEwAOAMyYAnOtWqALKoDsARnUBWMydUAaEAE9EO3TstDPhszdM6fAL4BDqgY2HhEpORUENQAUgDyAJIActx8gqKKUjJyCkjKiIYmJpgAbJomQjqq7iZ6Bg7OCGaalphVOm3+3ma1OkEh6Fj4AE5gKHLEUFzD1BAkWDjEAG6EANZYoSPjk8szwwjLa-h7JMIiF9nSsvLEiioIptplFqqWpmWWZSbemk2INraEqqTRCHxmQyaL6WQYgbaYMYTKYHDDUMCjUaEUaYCQAG0mADNsWhMAikXtprMMEdVoRTnliBcrgUcrd8qBHq9MD5NGZLJZNOp1J0dIYAQhDK5vIL+SYyoZLPUymU4QiAFaEZb7algeaLTDHDZbYaYTXaqmHI0Mu7MrKsm6Mh6IMo6ISYdQWKHFEzqKHWCWaMEdOqqV5+kxtNWm83EHVzDFYnH4okkskxrVxy0061nJmiFmSR13Z0IQWuMFQvSWfTVf5ORAAWn8HXe6nc3jKnqBQWCIGIhAgcEU22uuRLBUerR5rX5guFou8EsbNlcBks-iD84M8ujYVwBBIZEokDH7Puk8BgswhmqAu7bS+4obCEb+g9lilqkhUK0Xj3OzIvGGBnk6l5PF8uieN+pgmBuNhmBKZgVJgHxwRCmhdF2PwAWambAWAoETpyRTyje-gWGKVQqloZSBhYmDgmU7wfEIlQfKqfYInihAAEa8c0RbjhyhQILYhjlJGwpfH07wmEh6juoYwrGJG-RaIYvYBEAA */
    id: 'game',
    tsTypes: {} as import('./gameState.typegen').Typegen0,
    schema: {
      events: {} as CreateGameEvent | JoinGameEvent,
      services: {} as {
        createGame: CreateGameService;
        joinGame: JoinGameService;
      },
    },
    context: {
      gameId: undefined as string | undefined,
      nickname: undefined as string | undefined,
      lastMessage: undefined as string | undefined,
    },
    initial: 'disconnected',
    states: {
      disconnected: {
        on: {
          // When sending these two events, send the nickname and use an action to store it on the context
          CREATE_GAME: { target: 'creatingGame', actions: 'assignNickname' },
          JOIN_GAME: {
            target: 'joiningGame',
            actions: ['assignGameId', 'assignNickname'],
          },
        },
      },
      creatingGame: {
        entry: [],
        invoke: {
          src: 'createGame',
          onDone: { target: 'joiningGame', actions: ['assignGameId'] },
          onError: 'disconnected',
        },
      },
      joiningGame: {
        invoke: {
          src: 'joinGame',
          onDone: 'lobby',
          onError: 'disconnected',
        },
      },
      lobby: {},
    },
  },
  {
    actions: {
      assignNickname: assign((_, event) => {
        return { nickname: event.value.nickname };
      }),
      assignGameId: assign((_, event) => {
        let gameId: string;
        if (event.type === 'JOIN_GAME') {
          gameId = (event as JoinGameEvent).value.gameId;
        } else {
          gameId = event.data.gameId;
        }
        return { gameId };
      }),
    },
  }
);
