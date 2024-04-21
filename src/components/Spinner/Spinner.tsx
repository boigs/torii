import { Spinner as ChakraSpinner } from '@chakra-ui/react';

const Spinner = () => (
  <ChakraSpinner
    width='48px'
    thickness='4px'
    emptyColor='gray.200'
    color='blue.500'
    size='xl'
    speed='1.75s'
  />
);

export default Spinner;
