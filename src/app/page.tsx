'use client';

import React from 'react';

import { Center, Flex, Container } from '@chakra-ui/react'; 
import PlayerList from 'src/components/PlayerList';
import HostForm from 'src/components/HostForm/HostForm';
import JoinForm from 'src/components/JoinForm/JoinForm';

const Home: React.FC = () => {
  return (
    <Center>
      <Flex gap='12px' alignItems='flex-start'>
        <Flex flexDirection='column' gap='12px'>
          <HostForm />
          <JoinForm />
        </Flex>
        <PlayerList />
      </Flex>
    </Center>
  );
};

export default Home;
