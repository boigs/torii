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
  const submittedWords = round.playerWords[player.nickname] ?? [];
  const votedWord = round.playerVotingWords[player.nickname];

  return (
    <Card className={className} header={<Text>Voting Card</Text>}>
      {round.votingItem!.playerNickname === player.nickname ? (
        <VStack>
          <Text className={styles.hostInstructions}>
            Please wait while the players cast their votes for the words you
            submitted.
          </Text>
          <Spinner size='lg' />
        </VStack>
      ) : (
        <VStack className={styles.wordsContainer}>
          <Text className={styles.votingInstructions}>
            From the words you submitted, click the word you think matches with:{' '}
            <i>{round.votingItem!.word}.</i>
          </Text>
          <HStack className={styles.buttonsContainer}>
            {submittedWords.map((submittedWord) => (
              <Button
                key={submittedWord.word}
                isDisabled={submittedWord.isUsed}
                onClick={() => onWordClicked(submittedWord)}
                isActive={
                  !submittedWord.isUsed && votedWord === submittedWord.word
                }
                colorScheme='blue'
              >
                {submittedWord.word}
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
