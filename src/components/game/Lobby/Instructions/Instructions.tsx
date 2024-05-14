import { Text } from '@chakra-ui/react';

import Card from 'src/components/shared/Card';

import styles from './Instructions.module.scss';

interface InstructionsProps {
  className?: string;
}

const Instructions = ({ className }: InstructionsProps) => {
  return (
    <Card header='How to Play' className={className}>
      <Text className={styles.instructions}>
        • In each round, you will be presented with a random topic, you must{' '}
        <strong>write up to 8 words related to that topic</strong>.
      </Text>
      <br />
      <Text className={styles.instructions}>
        • Try to write words you think will{' '}
        <strong>match other participant&apos;s words</strong>.
      </Text>
      <br />
      <Text className={styles.instructions}>
        • After all rounds are over, whoever has{' '}
        <strong>more word matches with others wins</strong> the game.
      </Text>
    </Card>
  );
};

export default Instructions;
