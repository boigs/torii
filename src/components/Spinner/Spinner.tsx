import { Spinner as ChakraSpinner, ResponsiveValue } from '@chakra-ui/react';

interface SpinnerProps {
  size?: ResponsiveValue<string>;
}

const Spinner = ({ size }: SpinnerProps) => (
  <ChakraSpinner
    thickness='4px'
    emptyColor='gray.200'
    color='blue.500'
    size={size ?? 'xl'}
    speed='1.75s'
  />
);

export default Spinner;
