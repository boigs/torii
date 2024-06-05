import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import debounce from 'debounce';

import Card from 'src/components/shared/Card';
import Spinner from 'src/components/shared/Spinner';
import Player from 'src/domain/player';
import Round from 'src/domain/round';
import Word from 'src/domain/word';

import styles from './MatchingPanel.module.scss';

interface MatchingPanelProps {
  player: Player;
  round: Round;
  onWordClicked: (word: Word | null) => void;
  className?: string;
}

const MatchingPanel = ({
  player,
  round,
  onWordClicked,
  className,
}: MatchingPanelProps) => {
  const votingItem = round.getVotingItem();
  const words = round.getPlayerWords(player);
  const votedWord = round.getPlayerVotingWord(player);
  const haveAllWordsBeenUsed = words.every((word) => word.isUsed);
  const hasVoted = round.hasPlayerVoted(player);

  const onWordVoted = debounce((word: Word | null) => {
    onWordClicked(word);
  }, 100);

  return (
    <Card className={className} header='Matching Panel'>
      {votingItem.player === player ? (
        <VStack>
          <Text className={styles.hostInstructions}>
            Please wait while the players pick matches for the words you
            submitted (currently <b>{votingItem.word}</b>).
          </Text>
          <Spinner size='lg' />
        </VStack>
      ) : (
        <VStack className={styles.wordsContainer}>
          {haveAllWordsBeenUsed ? (
            <>
              <Text className={styles.matchingInstructions}>
                You have already used all your words, so you cannot use them for
                try to match them anymore. Please wait while other players
                propose their matches.
              </Text>
              <Spinner size='lg' />
            </>
          ) : (
            <>
              <Text className={styles.matchingInstructions}>
                From the words you submitted, click the word that matches with:{' '}
                <b>{votingItem.word}</b>.
              </Text>
              <HStack className={styles.buttonsContainer}>
                {words.map((submittedWord) => (
                  <Button
                    key={submittedWord.value}
                    isDisabled={
                      submittedWord.isUsed ||
                      votingItem.rejectedMatches
                        .get(player)
                        ?.has(submittedWord.value)
                    }
                    onClick={() => onWordVoted(submittedWord)}
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
                onClick={() => onWordVoted(null)}
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

export default MatchingPanel;
