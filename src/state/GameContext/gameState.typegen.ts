// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.game.creatingGame:invocation[0]': {
      type: 'done.invoke.game.creatingGame:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    createGame: 'done.invoke.game.creatingGame:invocation[0]';
    joinGame: 'done.invoke.game.joiningGame:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: 'createGame' | 'joinGame';
  };
  eventsCausingActions: {
    assignGameId: 'JOIN_GAME' | 'done.invoke.game.creatingGame:invocation[0]';
    assignNickname: 'CREATE_GAME' | 'JOIN_GAME';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    createGame: 'CREATE_GAME';
    joinGame: 'JOIN_GAME' | 'done.invoke.game.creatingGame:invocation[0]';
  };
  matchesStates: 'creatingGame' | 'disconnected' | 'joiningGame' | 'lobby';
  tags: never;
}
