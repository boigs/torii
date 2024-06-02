import { Spinner as ChakraSpinner, ResponsiveValue } from '@chakra-ui/react';

interface SpinnerProps {
  size?: ResponsiveValue<string>;
  className?: string;
}

const Spinner = ({ size, className }: SpinnerProps) => (
  <ChakraSpinner
    thickness='4px'
    emptyColor='gray.200'
    color='blue.500'
    size={size ?? 'xl'}
    speed='1.75s'
    className={className}
  />
);

export default Spinner;
