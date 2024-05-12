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
  const { gameConnectionActor, isInsideOfGame } = useGameContext();
  const [gameConnection] = [gameConnectionActor.getSnapshot()];
  const realId = id?.[0];

  useEffect(() => {
    if (gameConnection.context.gameJoined) {
      gameConnectionActor.send({ type: 'RESET' });
    } else if (isInsideOfGame) {
      router.push('/game');
    }
  }, [gameConnection, router, isInsideOfGame, gameConnectionActor]);

  return (
    <Center>
      <JoinGameForm
        gameId={realId}
        loading={!gameConnection.matches('disconnected')}
        onSubmit={({ gameId, nickname }) => {
          gameConnectionActor.send({ type: 'JOIN_GAME', gameId, nickname });
        }}
      />
    </Center>
  );
};

export default Join;
