import {
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from '@chakra-ui/react';

import Card from 'src/components/Card';
import { Player } from 'src/domain';
import Round from 'src/domain/round';

import styles from './WordScores.module.scss';

interface WordScores {
  player: Player;
  round: Round;
  className?: string;
}

const WordScores = ({ player, round, className }: WordScores) => {
  const words = round.getPlayerWords(player.nickname);

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
            <Center className={styles.score}>
              <Text>{word.score}</Text>
            </Center>
          </Flex>
        ))}
      </VStack>
    </Card>
  );
};

export default WordScores;
