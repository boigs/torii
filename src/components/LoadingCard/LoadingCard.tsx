import { Center, Spinner, Text } from '@chakra-ui/react';

import Card from 'src/components/Card';

import styles from './LoadingCard.module.scss';

const LoadingCard: React.FC = () => (
  <Card header='Loading...'>
    <Text align='center' className={styles.loadingText}>
      Loading, please wait...
    </Text>
    <Center>
      <Spinner
        thickness='4px'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
        speed='1.75s'
      />
    </Center>
  </Card>
);

export default LoadingCard;
