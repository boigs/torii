'use client';

import { Center, Container } from '@chakra-ui/react';
import React from 'react';
import PlayerDisplay from 'src/components/PlayerDisplay';

const Home: React.FC = () => {
  return (
    <Center>
      <Container centerContent>
        <PlayerDisplay />
      </Container>
    </Center>
  );
};

export default Home;
