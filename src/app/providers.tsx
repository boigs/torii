import { ChakraProvider } from '@chakra-ui/react';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);
