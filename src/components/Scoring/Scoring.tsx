import {
  Center,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from '@chakra-ui/react';
import classNames from 'classnames';

import Card from 'src/components/Card';
import Avatar from 'src/components/JoinedPlayersList/PlayerList/Player/Avatar';
import { Player } from 'src/domain';

import styles from './Scoring.module.scss';

type ScoringProps = {
  player: Player;
  submittedWords: string[];
  currentVotingWord: string;
  className?: string;
};

const Scoring: React.FC<ScoringProps> = ({
  player,
  submittedWords,
  currentVotingWord,
}) => {
  return (
    <Card
      header={
        <>
          <Center>
            <HStack>
              <Avatar player={player} /> <Text>{player.nickname}</Text>
            </HStack>
          </Center>
        </>
      }
    >
      <VStack>
        {submittedWords.map((submittedWord, index) => (
          <InputGroup
            key={index}
            className={classNames(
              currentVotingWord === submittedWord
                ? styles.currentVotingWord
                : null
            )}
          >
            <InputLeftAddon className={styles.wordInputLeftAddon}>
              {index + 1}.
            </InputLeftAddon>
            <Input
              readOnly={true}
              className={styles.wordInput}
              value={submittedWord}
            />
          </InputGroup>
        ))}
      </VStack>
    </Card>
  );
};

export default Scoring;
