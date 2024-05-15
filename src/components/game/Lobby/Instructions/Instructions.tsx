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
          Each round will present a random topic, and you must{' '}
          <b>write up to 8 words related to that topic</b>.
        </ListItem>
        <ListItem>
          Try to write words you think will{' '}
          <b>match other participants&apos; words</b>.
        </ListItem>
        <ListItem>
          After all rounds are over, whoever has{' '}
          <b>matched more words with others wins</b> the game.
        </ListItem>
      </UnorderedList>
    </Card>
  );
};

export default Instructions;
