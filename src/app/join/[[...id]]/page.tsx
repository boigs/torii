'use client';

import React, { useContext, useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import JoinForm from 'src/components/JoinForm/JoinForm';

type JoinQuery = {
  params: {
    id?: string[]; // single optional path params are not supported yet by NextJS
  };
};

const Join: React.FC<JoinQuery> = ({ params: { id } }) => {
  const router = useRouter();
  const { gameFsm } = useContext(Context);
  const [state, send] = useActor(gameFsm);
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
