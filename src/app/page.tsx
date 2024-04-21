'use client';

import { useContext, useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import CreateGameForm from 'src/components/CreateGameForm';

const Home = () => {
  const router = useRouter();
  const { gameActor } = useContext(Context);
  const [state, send] = [gameActor.getSnapshot(), gameActor.send];

  useEffect(() => {
    if (state.context.gameJoined) {
      send({ type: 'RESET' });
    } else if (state.matches('lobby')) {
      router.push('/game');
    }
  }, [state, send, router]);

  return (
    <Center>
      <CreateGameForm
        loading={!state.matches('disconnected')}
        onSubmit={({ nickname }) => send({ type: 'CREATE_GAME', nickname })}
      />
    </Center>
  );
};

export default Home;
