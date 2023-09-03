'use client';

import { Center } from '@chakra-ui/react';
import React from 'react';
import PlayerList from 'src/components/PlayerList/PlayerList';

const Lobby: React.FC = () => {
  return (
    <Center>
      <PlayerList />
    </Center>
  );
};

export default Lobby;

