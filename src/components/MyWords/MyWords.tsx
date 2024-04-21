import {
  Button,
  Center,
  HStack,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from '@chakra-ui/react';

import Card from 'src/components/Card';
import Avatar from 'src/components/JoinedPlayersList/PlayerList/Player/Avatar';
import { Player, Round } from 'src/domain';

import styles from './MyWords.module.scss';

interface MyWordsProps {
  round: Round;
  player: Player;
  className?: string;
}

function MyWords({ round, player }: MyWordsProps) {
  const submittedWords = round.playerWords[player.nickname];

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
        {submittedWords.map((submittedWord, index) => (
          <InputGroup key={index}>
            <InputLeftAddon className={styles.wordInputLeftAddon}>
              {index + 1}.
            </InputLeftAddon>
            <Button colorScheme='blue' variant='outline'>
              {submittedWord.word}
            </Button>
          </InputGroup>
        ))}
      </VStack>
    </Card>
  );
}

export default MyWords;
