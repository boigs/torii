import { useState } from 'react';

import { Button, Center, HStack, Text, VStack } from '@chakra-ui/react';

import Card from 'src/components/Card';
import Avatar from 'src/components/JoinedPlayersList/PlayerList/Player/Avatar';
import { Player, Round, Word } from 'src/domain';

interface MyWordsProps {
  round: Round;
  player: Player;
  onWordClicked: (word: Word | null) => void;
  className?: string;
}

const MyWords = ({ round, player, onWordClicked }: MyWordsProps) => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const submittedWords = round.playerWords[player.nickname] ?? [];

  const onWordButtonClicked = (submittedWord: Word | null) => {
    setSelectedWord(submittedWord);
    onWordClicked(submittedWord);
  };

  return round.score.currentPlayer === player.nickname ? null : (
    <Card
      header={
        <Center>
          <HStack>
            <Avatar player={player} />
            <Text>{player.nickname}</Text>
          </HStack>
        </Center>
      }
    >
      <VStack>
        <Text>
          Click the word you think matches
          <i>&quot;{round.score.currentWord}&quot;</i>
        </Text>
        <HStack>
          {submittedWords.map((submittedWord) => (
            <Button
              disabled={submittedWord.isUsed}
              key={submittedWord.word}
              colorScheme='blue'
              onClick={() => onWordButtonClicked(submittedWord)}
              isActive={selectedWord?.word === submittedWord.word}
            >
              {submittedWord.word}
            </Button>
          ))}
          <Button
            isActive={selectedWord === null}
            colorScheme='gray'
            onClick={() => onWordButtonClicked(null)}
          >
            Skip
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};

export default MyWords;
