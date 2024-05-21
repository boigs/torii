import { Center, Link as ChakraLink, Text } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

import Card from 'src/components/shared/Card';

import styles from './404.module.scss';

const NotFound = () => {
  return (
    <Center>
      <Card header='Not Found' className={styles.notFound}>
        <Text>There does not seem to be anything here.</Text>
        <Text>
          Would you like to{' '}
          <ChakraLink as={ReactRouterLink} color='blue' to='/'>
            create a new game
          </ChakraLink>{' '}
          or perhaps{' '}
          <ChakraLink as={ReactRouterLink} color='blue' to='/join'>
            join one
          </ChakraLink>
          ?
        </Text>
      </Card>
    </Center>
  );
};

export default NotFound;
