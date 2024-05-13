import React from 'react';

import { Text } from '@chakra-ui/react';

import Card from 'src/components/Shared/Card';

import styles from './Instructions.module.scss';

interface InstructionsProps {
  className?: string;
}

const Instructions = ({ className }: InstructionsProps) => {
  return (
    <Card header='How to Play' className={className}>
      <Text className={styles.instructions}>
        In each round, you will be presented with a random topic, you must write
        up to 8 words related to that topic. But beware! You should try to match
        the answers of as many participants as possible. After all rounds are
        over, whoever has matched the most answers with others will win the
        game.
      </Text>
    </Card>
  );
};

export default Instructions;
