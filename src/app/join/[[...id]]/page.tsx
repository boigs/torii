'use client';

import { useContext, useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import JoinForm from 'src/components/JoinForm/JoinForm';

interface JoinQuery {
  params: {
    id?: string[]; // single optional path params are not supported yet by NextJS
  };
}

const Join = ({ params: { id } }: JoinQuery) => {
  const router = useRouter();
  const { gameActor } = useContext(Context);
  const [state, send] = [gameActor.getSnapshot(), gameActor.send];
  const realId = id?.[0];

  useEffect(() => {
    if (state.context.gameJoined) {
      send({ type: 'RESET' });
    } else if (state.matches('lobby')) {
      router.push('/game');
    }
  }, [state, send, router]);

  return (
    <Center>
      <JoinForm
        gameId={realId}
        loading={!state.matches('disconnected')}
        onSubmit={({ gameId, nickname }) =>
          send({ type: 'JOIN_GAME', value: { gameId, nickname } })
        }
      />
    </Center>
  );
};

export default Join;
