import {
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';

import Card from 'src/components/Card';
import { Player, Round, Word } from 'src/domain';

import styles from './WordScores.module.scss';

interface WordScores {
  player: Player;
  round: Round;
  className?: string;
}

const WordScores = ({ player, round, className }: WordScores) => {
  const words = round.getPlayerWords(player.nickname);

  const currentlyVotingForMyWord = (votingWord: Word) => {
    const { nickname, word } = round.getVotingItem();
    return player.nickname === nickname && word === votingWord.value;
  };

  const hasWordBeenUsed = (votingWord: Word) => {
    return votingWord.isUsed && !currentlyVotingForMyWord(votingWord);
  };

  return (
    <Card header='Score' className={className}>
      <VStack>
        <Text className={styles.description}>
          These are the words you submitted and their current score on the
          right.
        </Text>
        {words.map((word, index) => (
          <Flex key={index} className={styles.scoreContainer}>
            <InputGroup>
              <InputLeftAddon className={styles.wordLeftAddon}>
                {index + 1}.
              </InputLeftAddon>
              <Input
                readOnly={true}
                className={styles.word}
                value={word.value}
              />
            </InputGroup>
            <Tooltip
              placement='right'
              hasArrow
              label={
                hasWordBeenUsed(word) ? undefined : 'Not used in a vote yet'
              }
            >
              <Center className={styles.score}>
                <Text>{hasWordBeenUsed(word) ? word.score : '-'}</Text>
              </Center>
            </Tooltip>
          </Flex>
        ))}
      </VStack>
    </Card>
  );
};

export default WordScores;
