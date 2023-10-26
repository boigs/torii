import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';
import config from 'src/config';
import { assign } from 'lodash';

enum State {
  DISCONNECTED = 'disconnected',
  CREATING_GAME = 'creatingGame',
  JOINING_GAME = 'joiningGame',
  LOBBY = 'lobby',
}

enum Event {
  CREATE_GAME = 'CREATE_GAME',
  JOIN_GAME = 'JOIN_GAME',
}

enum Services {
  CREATE_GAME = "createGame",
  JOIN_GAME = "joinGame"
}

enum Action {
  ASSIGN_PLAYER_DETAILS_CONTEXT = "assignPlayerDetailsContext"
}

const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgl1kwHt9DMAXSAYgGEAlAUQEEAVDgfQDiXALIcA2gAYAuolAAHKrFz1cNOSAAeiAEw7JJAIwAWABymA7MckA2C7Zu2ANCACeugKwejHm3smSHgCcQaZBOgC+ES5oWHiEpOSUNHSMEEwAUgDyAJIAckKiEjIaisqq6khauvpGZpbWdg7ObogAzDbepo06hh7GJsZeNlExGDgExCSYAE5g6Kr4UILoqGBMEDRgJAQAblQA1tuxEwnTcwsEy6tgCHtUmJc0UtIvpUoqavga2giOpiQPIYgoZbKC2qYdKEXO4EHpjCQLMEgsY2r19AFIaMQCd4lNZvNFtc1kwwDMZlQZiR5AAbBYAM0pqBIuMmpAJlyWKzWd3w+0eFXwLzeVTKn0qoF+-jq5istnsNkcNhhukkAKCAQ8FjaHnRSOM2NZZwAVlQCFduetNoQdnzDsdxnjSKbzVybrz+U8hTIRQoPoKfohQgYLJ1gQ4bMYdBYgiq4dGSDpkTo2hZTG0gl4U4bHWySC78BabqTyZTqXT6IyZsyjVMC0WefcBV9hSVRf6voG-gm2m0BqY-B5JFYdXHTIYjOPTB4dXZLJJDJFsfgqBA4Bpa0R3uVO1VfgBaZWtBCHkgBc8Xy8WHNxPNJai0MAMSDb8XfPeIKNxjUkGyLwwWAB5jGAMII3qc+IXESlqvgGH4INYOhnhmw4DIqUJ9nGwJBCQpiSEEnRyiC45DOBTr5mahZumssG7pKiAxhO+ppoqNhhIYYRxvoSFtPhhHWMRJgeGReY0lQABG4mwn6O4StUCCGCYNiAm0hgQkMA4dJGXFJr+IHDhxWpeCBphRFEQA */
  id: 'game',
  tsTypes: {} as import("./gameState.typegen").Typegen0,
  schema: {
    events: {} as
    | {
        type: Event.CREATE_GAME,
        value: string
    }
    | {
        type: Event.JOIN_GAME,
        value: string
    }
    ,
    services: {} as {
      [Services.CREATE_GAME]: {
        data: string
      },
      [Services.JOIN_GAME]: {
        data: string
      }
    }
  },
  context: {
    playerDetails: {} as { gameId: string, nickname: string }
  },
  initial: State.DISCONNECTED,
  states: {
    [State.DISCONNECTED]: {
      on: {
        // When sending these two events, send the nickname and use an action to store it on the context
        [Event.CREATE_GAME]: [{target: State.CREATING_GAME, actions: 'assignNicknameToContext'}],
        [Event.JOIN_GAME]: State.JOINING_GAME,
      },
    },
    [State.CREATING_GAME]: {
      invoke: {
        src: 'createGame',
        onDone: State.JOINING_GAME,
        onError: State.DISCONNECTED,
      },
    },
    [State.JOINING_GAME]: {
      invoke: {
        src: Services.JOIN_GAME,
        onDone: {target: State.LOBBY, actions: 'assignPlayerDetailsToContext'},
        onError: State.DISCONNECTED,
      },
    },
    [State.LOBBY]: {},
  },
},
{
  actions: {
    assignPlayerDetailsToContext: assign((context, event) => {
      return {
        playerDetails: "a"
      }
    }),
    assignNicknameToContext: assign((context, event) => {
      return {
      }
    })
  },
});

const [state, send] = useMachine(gameMachine, {
  services: {
    [Services.CREATE_GAME]: async () => {
      let gameId = await fetch(`${config.headcrabHttpBaseUrl}/game`, {
        method: 'POST',
      })
        .then((response: any) => response.json())
        .then((response: any) => response.id);
      return gameId;
    },
    [Services.JOIN_GAME]: async (context, event) => {},
  }
});