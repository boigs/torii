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

import styles from './VotingItems.module.scss';

interface ScoringProps {
  player: Player;
  round: Round;
  className?: string;
}

const VotingItems = ({ round, player, className }: ScoringProps) => {
  const votingItem = round.getVotingItem();
  const words = round.getPlayerWords(votingItem.player);
  const votingWordIndex = words.findIndex(
    (word) => word.value === votingItem.word
  );

  return (
    <Card
      className={className}
      header={
        <Center>
          <HStack>
            <Avatar size={24} player={votingItem.player} />
            <Text>{votingItem.player.nickname}</Text>
          </HStack>
        </Center>
      }
    >
      <VStack>
        <Text className={styles.instructions}>
          {votingItem.player == player
            ? 'These are the words you submitted:'
            : `These are the words submitted by ${votingItem.player.nickname}:`}
        </Text>
        {words.map((word, index) => (
          <InputGroup key={index}>
            <InputLeftAddon className={styles.wordInputLeftAddon}>
              {index + 1}.
            </InputLeftAddon>
            <Skeleton
              className={styles.skeleton}
              startColor='gray.300'
              endColor='gray.200'
              isLoaded={index <= votingWordIndex}
            >
              <Input
                readOnly={true}
                className={styles.wordInput}
                value={word.value}
              />
            </Skeleton>
          </InputGroup>
        ))}
      </VStack>
    </Card>
  );
};

export default VotingItems;
