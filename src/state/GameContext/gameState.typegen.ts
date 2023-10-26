
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.game.creatingGame:invocation[0]": { type: "done.invoke.game.creatingGame:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.game.joiningGame:invocation[0]": { type: "done.invoke.game.joiningGame:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "createGame": "done.invoke.game.creatingGame:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: "createGame";
        };
        eventsCausingActions: {
          "assignNicknameToContext": "CREATE_GAME";
"assignPlayerDetailsToContext": "done.invoke.game.joiningGame:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "createGame": "CREATE_GAME";
        };
        matchesStates: "creatingGame" | "disconnected" | "joiningGame" | "lobby";
        tags: never;
      }
  