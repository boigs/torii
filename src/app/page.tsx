'use client';

import React from 'react';

import { Center, Flex } from '@chakra-ui/react';
import HostForm from 'src/components/HostForm/HostForm';

const Home: React.FC = () => {
  return (
    <Center>
      <Flex gap='12px' alignItems='flex-start'>
        <Flex flexDirection='column' gap='12px'>
          <HostForm />
        </Flex>
      </Flex>
    </Center>
  );
};

export default Home;

