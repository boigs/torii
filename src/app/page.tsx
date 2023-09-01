'use client';

import React from 'react';

import { Center, Container } from '@chakra-ui/react'; 
import PlayerList from 'src/components/PlayerList';

const Home: React.FC = () => {
  return (
    <Center>
      <Container centerContent>
        <PlayerList />
      </Container>
    </Center>
  );
};

export default Home;
