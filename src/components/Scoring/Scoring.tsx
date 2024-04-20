import {
  Center,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';

import Card from 'src/components/Card';
import Avatar from 'src/components/JoinedPlayersList/PlayerList/Player/Avatar';
import { Player, Word } from 'src/domain';

import styles from './Scoring.module.scss';

type ScoringProps = {
  player: Player;
  submittedWords: Word[];
  currentVotingWord: string;
  className?: string;
};

const Scoring: React.FC<ScoringProps> = ({
  player,
  submittedWords,
  currentVotingWord,
}) => {
  const currentVotingWordIndex = submittedWords.findIndex(
    (word) => word.word === currentVotingWord
  );

  return (
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
        {submittedWords.map((submittedWord, index) => (
          <InputGroup key={index} className={styles.inputGroup}>
            <InputLeftAddon>{index + 1}.</InputLeftAddon>
            <Skeleton
              className={styles.skeleton}
              startColor='gray.300'
              endColor='gray.200'
              isLoaded={index <= currentVotingWordIndex}
            >
              <Input
                readOnly={true}
                className={styles.wordInput}
                value={submittedWord.word}
              />
            </Skeleton>
          </InputGroup>
        ))}
      </VStack>
    </Card>
  );
};

export default Scoring;
