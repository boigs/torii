'use client';

import { useContext, useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import CreateGameForm from 'src/components/CreateGame/CreateGameForm';
import { GameContext } from 'src/components/GameContextProvider';

const Home = () => {
  const router = useRouter();
  const { gameActor } = useContext(GameContext);
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
        onSubmit={({ nickname }) => {
          send({ type: 'CREATE_GAME', nickname });
        }}
      />
    </Center>
  );
};

export default Home;
