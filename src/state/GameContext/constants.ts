import { UseToastOptions } from '@chakra-ui/react';

export const UNKNOWN_WS_ERROR: UseToastOptions = {
  status: 'error',
  isClosable: true,
  duration: 5000,
  description: 'Unknown error occurred; please contact support.',
  position: 'top',
};

export const HEARTBEAT = {
  message: 'ping',
  returnMessage: 'pong',
  timeout: 3000, // 3 seconds, if no response is received, the connection will be closed
  interval: 1000, // every 1 second, a ping message will be sent
};
