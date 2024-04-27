import { useEffect, useState } from 'react';

import { Button, HStack, Text, VStack } from '@chakra-ui/react';

import Card from 'src/components/Card';
import { Player, Round, Word } from 'src/domain';

import styles from './MyWords.module.scss';

interface MyWordsProps {
  round: Round;
  player: Player;
  onWordClicked: (word: Word | null) => void;
  className?: string;
}

const MyWords = ({ round, player, onWordClicked }: MyWordsProps) => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [anyButtonClicked, setAnyButtonClicked] = useState(false);
  const submittedWords = round.playerWords[player.nickname] ?? [];

  const onWordButtonClicked = (submittedWord: Word | null) => {
    setSelectedWord(submittedWord);
    setAnyButtonClicked(true);
    onWordClicked(submittedWord);
  };

  useEffect(() => {
    setSelectedWord(null);
    setAnyButtonClicked(false);
  }, [round.score.currentWord]);

  return round.score.currentPlayer === player.nickname ? null : (
    <Card header={<Text>Voting Card</Text>}>
      <VStack className={styles.wordsContainer}>
        <Text className={styles.votingInstructions}>
          From the words you submitted, click the word you think matches{' '}
          <i>&quot;{round.score.currentWord}&quot;</i>
        </Text>
        <HStack className={styles.buttonsContainer}>
          {submittedWords.map((submittedWord) => (
            <Button
              key={submittedWord.word}
              isDisabled={submittedWord.isUsed}
              onClick={() => onWordButtonClicked(submittedWord)}
              isActive={
                !submittedWord.isUsed &&
                selectedWord?.word === submittedWord.word
              }
              colorScheme='blue'
            >
              {submittedWord.word}
            </Button>
          ))}
        </HStack>
        <Button
          isActive={anyButtonClicked && selectedWord === null}
          colorScheme='gray'
          onClick={() => onWordButtonClicked(null)}
        >
          Skip
        </Button>
      </VStack>
    </Card>
  );
};

export default MyWords;
