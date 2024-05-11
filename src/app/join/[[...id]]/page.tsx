'use client';

import { useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { useGameContext } from 'src/components/GameContextProvider';
import JoinGameForm from 'src/components/JoinGame/JoinForm';

interface JoinQuery {
  params: {
    id?: string[]; // single optional path params are not supported yet by NextJS
  };
}

const Join = ({ params: { id } }: JoinQuery) => {
  const router = useRouter();
  const { gameActor, isInsideOfGame } = useGameContext();
  const [state, send] = [gameActor.getSnapshot(), gameActor.send];
  const realId = id?.[0];

  useEffect(() => {
    if (state.context.gameJoined) {
      send({ type: 'RESET' });
    } else if (isInsideOfGame) {
      router.push('/game');
    }
  }, [state, send, router, isInsideOfGame]);

  return (
    <Center>
      <JoinGameForm
        gameId={realId}
        loading={!state.matches('disconnected')}
        onSubmit={({ gameId, nickname }) => {
          send({ type: 'JOIN_GAME', gameId, nickname });
        }}
      />
    </Center>
  );
};

export default Join;
