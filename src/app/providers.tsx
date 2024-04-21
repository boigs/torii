'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <CacheProvider>
    <ChakraProvider>{children}</ChakraProvider>
  </CacheProvider>
);
