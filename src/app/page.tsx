'use client';

import React, { useContext, useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import CreateGameForm from 'src/components/CreateGameForm';

const Home: React.FC = () => {
  const router = useRouter();
  const { gameFsm } = useContext(Context);
  const [state, send] = useActor(gameFsm);

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
        onSubmit={({ nickname }) =>
          send({ type: 'CREATE_GAME', value: { nickname } })
        }
      />
    </Center>
  );
};

export default Home;
