import { Button, HStack, Text, VStack } from '@chakra-ui/react';

import Card from 'src/components/Card';
import Spinner from 'src/components/Spinner';
import { Player, Round, Word } from 'src/domain';

import styles from './VotingCard.module.scss';

interface VotingCardProps {
  you: Player;
  round: Round;
  onWordClicked: (word: Word | null) => void;
  className?: string;
}

const VotingCard = ({
  you,
  round,
  onWordClicked,
  className,
}: VotingCardProps) => {
  const votingItem = round.getVotingItem();
  const words = round.getPlayerWords(you);
  const votedWord = round.getPlayerVotingWord(you);
  const haveAllWordsBeenUsed = words.every((word) => word.isUsed);
  const hasVoted = round.hasPlayerVoted(you);

  return (
    <Card className={className} header={<Text>Voting Card</Text>}>
      {votingItem.player === you ? (
        <VStack>
          <Text className={styles.hostInstructions}>
            Please wait while the players cast their votes for the words you
            submitted (currently <i>{votingItem.word}</i>).
          </Text>
          <Spinner size='lg' />
        </VStack>
      ) : (
        <VStack className={styles.wordsContainer}>
          {haveAllWordsBeenUsed ? (
            <>
              <Text className={styles.votingInstructions}>
                You have already used all your words, so you cannot use them for
                voting. Please wait while other players cast their votes.
              </Text>
              <Spinner size='lg' />
            </>
          ) : (
            <>
              <Text className={styles.votingInstructions}>
                From the words you submitted, click the word you think matches
                with: <i>{votingItem.word}.</i>
              </Text>
              <HStack className={styles.buttonsContainer}>
                {words.map((submittedWord) => (
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
                isActive={hasVoted && votedWord === null}
                colorScheme='gray'
                onClick={() => onWordClicked(null)}
              >
                Skip
              </Button>
            </>
          )}
        </VStack>
      )}
    </Card>
  );
};

export default VotingCard;
