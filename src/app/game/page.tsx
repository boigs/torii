'use client';

import { useContext, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import Disconnected from 'src/components/Game/Disconnected';
import EndOfGame from 'src/components/Game/EndOfGame';
import EndOfRound from 'src/components/Game/EndOfRound';
import Lobby from 'src/components/Game/Lobby';
import PlayersSubmittingVotingWord from 'src/components/Game/PlayersSubmittingVotingWord';
import PlayersSubmittingWords from 'src/components/Game/PlayersSubmittingWords';

const Game = () => {
  const router = useRouter();
  const { gameActor, sendWebsocketMessage, isInsideOfGame } =
    useContext(Context);
  const [state, send] = [gameActor.getSnapshot(), gameActor.send];

  useEffect(() => {
    if (state.matches('disconnected')) {
      router.replace('/join');
    }
    if (isInsideOfGame && !state.context.gameJoined) {
      send({ type: 'GAME_JOINED' });
    }
  }, [state, send, router, isInsideOfGame]);

  switch (state.value) {
    case 'disconnected':
      return <Disconnected />;
    case 'lobby':
      return (
        <Lobby
          game={state.context.game}
          messages={state.context.messages}
          sendWebsocketMessage={sendWebsocketMessage}
        />
      );
    case 'playersSubmittingWords':
      return (
        <PlayersSubmittingWords
          game={state.context.game}
          messages={state.context.messages}
          sendWebsocketMessage={sendWebsocketMessage}
        />
      );
    case 'playersSubmittingVotingWord':
      return (
        <PlayersSubmittingVotingWord
          game={state.context.game}
          messages={state.context.messages}
          sendWebsocketMessage={sendWebsocketMessage}
        />
      );
    case 'endOfRound':
      return (
        <EndOfRound
          game={state.context.game}
          messages={state.context.messages}
          sendWebsocketMessage={sendWebsocketMessage}
        />
      );
    case 'endOfGame':
      return (
        <EndOfGame
          game={state.context.game}
          messages={state.context.messages}
          sendWebsocketMessage={sendWebsocketMessage}
        />
      );
    default:
      throw new Error(
        `The Game page does not support the '${state.value}' state`,
      );
  }
};

export default Game;
