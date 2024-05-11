import { Center, Text } from '@chakra-ui/react';

import Card from 'src/components/Shared/Card';
import Spinner from 'src/components/Shared/Spinner';

import styles from './LoadingCard.module.scss';

const LoadingCard = () => (
  <Card header='Loading...'>
    <Text align='center' className={styles.loadingText}>
      Loading, please wait...
    </Text>
    <Center>
      <Spinner />
    </Center>
  </Card>
);

export default LoadingCard;
