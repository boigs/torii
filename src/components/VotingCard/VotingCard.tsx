import { Button, HStack, Text, VStack } from '@chakra-ui/react';

import Card from 'src/components/Card';
import Spinner from 'src/components/Spinner';
import { Player, Round, Word } from 'src/domain';

import styles from './VotingCard.module.scss';

interface VotingCardProps {
  round: Round;
  player: Player;
  onWordClicked: (word: Word | null) => void;
  className?: string;
}

const VotingCard = ({
  round,
  player,
  onWordClicked,
  className,
}: VotingCardProps) => {
  const submittedWords = round.getPlayerWords(player.nickname);
  const votedWord = round.getPlayerVotingWord(player.nickname);

  return (
    <Card className={className} header={<Text>Voting Card</Text>}>
      {round.getVotingItem().nickname === player.nickname ? (
        <VStack>
          <Text className={styles.hostInstructions}>
            Please wait while the players cast their votes for the words you
            submitted (currently <i>{round.getVotingItem().word}</i>).
          </Text>
          <Spinner size='lg' />
        </VStack>
      ) : (
        <VStack className={styles.wordsContainer}>
          <Text className={styles.votingInstructions}>
            From the words you submitted, click the word you think matches with:{' '}
            <i>{round.getVotingItem().word}.</i>
          </Text>
          <HStack className={styles.buttonsContainer}>
            {submittedWords.map((submittedWord) => (
              <Button
                key={submittedWord.value}
                isDisabled={submittedWord.isUsed}
                onClick={() => onWordClicked(submittedWord)}
                isActive={
                  !submittedWord.isUsed && votedWord === submittedWord.value
                }
                colorScheme='blue'
              >
                {submittedWord.value}
              </Button>
            ))}
          </HStack>
          <Button
            isActive={votedWord === null}
            colorScheme='gray'
            onClick={() => onWordClicked(null)}
          >
            Skip
          </Button>
        </VStack>
      )}
    </Card>
  );
};

export default VotingCard;
