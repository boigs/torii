import { ListItem, Text, UnorderedList } from '@chakra-ui/react';

import Card from 'src/components/shared/Card';

import styles from './Instructions.module.scss';

interface InstructionsProps {
  className?: string;
}

const Instructions = ({ className }: InstructionsProps) => {
  return (
    <Card header='How to Play' className={className}>
      <UnorderedList className={styles.instructions} stylePosition='inside'>
        <ListItem>
          Each round will present a random topic, you must{' '}
          <strong>write up to 8 words related to that topic</strong>.
        </ListItem>
        <ListItem>
          Try to write words you think will{' '}
          <strong>match other participants&apos; words</strong>.
        </ListItem>
        <ListItem>
          After all rounds are over, whoever has{' '}
          <strong>matched more words with others wins</strong> the game.
        </ListItem>
      </UnorderedList>
    </Card>
  );
};

export default Instructions;
