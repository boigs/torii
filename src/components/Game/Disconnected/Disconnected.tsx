import { Center } from '@chakra-ui/react';

import AnimatedParent from 'src/components/Shared/AnimatedParent';
import LoadingCard from 'src/components/Shared/LoadingCard';

import styles from './Disconnected.module.scss';

const Disconnected = () => {
  return (
    <Center>
      <AnimatedParent className={styles.gameContainerGrid}>
        <LoadingCard />
      </AnimatedParent>
    </Center>
  );
};

export default Disconnected;
