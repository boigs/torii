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
import { Player, Round } from 'src/domain';

import styles from './Scoring.module.scss';

interface ScoringProps {
  round: Round;
  you: Player;
  players: Player[];
  className?: string;
}

const Scoring = ({ round, you, players, className }: ScoringProps) => {
  const player = players.find(
    (player) => player.nickname === round.score.currentPlayer
  )!;
  const submittedWords = round.playerWords[player.nickname];
  const currentVotingWord = round.score.currentWord;
  const currentVotingWordIndex = submittedWords.findIndex(
    (word) => word.word === currentVotingWord
  );

  return (
    <Card
      className={className}
      header={
        <Center>
          <HStack>
            <Avatar size={24} player={player} />
            <Text>{player.nickname}</Text>
          </HStack>
        </Center>
      }
    >
      <VStack>
        <Text className={styles.instructions}>
          {you.nickname === player.nickname
            ? 'These are the words you submitted:'
            : `These are the words submitted by ${player.nickname}:`}
        </Text>
        {submittedWords.map((submittedWord, index) => (
          <InputGroup key={index}>
            <InputLeftAddon className={styles.wordInputLeftAddon}>
              {index + 1}.
            </InputLeftAddon>
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
