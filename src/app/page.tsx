'use client';

import React, { useContext, useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import HostForm from 'src/components/HostForm';

const Home: React.FC = () => {
  const router = useRouter();
  const { gameFsm } = useContext(Context);
  const [state, send] = useActor(gameFsm);

  useEffect(() => {
    if (state.context.gameJoined) {
      send('RESET');
    } else if (state.matches('lobby')) {
      router.push('/game');
    }
  }, [state, send, router]);

  return (
    <Center>
      <HostForm
        loading={!state.matches('disconnected')}
        onSubmit={({ nickname }) =>
          send({ type: 'CREATE_GAME', value: { nickname } })
        }
      />
    </Center>
  );
};

export default Home;
