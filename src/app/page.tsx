'use client';

import React, { useContext, useEffect, useLayoutEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useActor, useInterpret } from '@xstate/react';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import HostForm from 'src/components/HostForm';

const Home: React.FC = () => {
  const router = useRouter();
  const { gameFsm } = useContext(Context);
  const [state, send] = useActor(gameFsm);

  useLayoutEffect(() => {
    send('RESET');
  }, [send]);

  return (
    <Center>
      <HostForm
        loading={!state.matches('disconnected')}
        onSubmit={({ nickname }) => {
          send({ type: 'CREATE_GAME', value: { nickname } });
          router.push('/game');
        }}
      />
    </Center>
  );
};

export default Home;
