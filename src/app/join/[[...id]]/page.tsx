'use client';

import React from 'react';

import { Center } from '@chakra-ui/react';

import JoinForm from 'src/components/JoinForm/JoinForm';

type JoinQuery = {
  params: {
    id?: string[]; // single optional path params are not supported yet by NextJS
  };
};

const Join: React.FC<JoinQuery> = ({ params: { id } }) => {
  const realId = id?.[0];

  return (
    <Center>
      <JoinForm gameId={realId} />
    </Center>
  );
};

export default Join;
