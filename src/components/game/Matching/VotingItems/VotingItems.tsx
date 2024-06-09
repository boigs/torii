import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Center,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';

import Card from 'src/components/shared/Card';
import Avatar from 'src/components/shared/JoinedPlayersList/PlayerList/Player/Avatar';
import Player from 'src/domain/player';
import Round from 'src/domain/round';

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
    (word) => word.value === votingItem.word,
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
          {votingItem.player === player
            ? 'You wrote:'
            : `${votingItem.player.nickname} wrote:`}
        </Text>
        <InputGroup>
          <InputLeftAddon className={styles.wordInputLeftAddon}>
            {votingWordIndex + 1}.
          </InputLeftAddon>
          <Input
            readOnly={true}
            className={styles.wordInput}
            value={votingItem.word}
          />
        </InputGroup>
        <Accordion allowToggle className={styles.accordion}>
          <AccordionItem>
            <AccordionButton className={styles.accordionButton}>
              <Text className={styles.showAll}>Show all</Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel className={styles.accordionPanel}>
              <VStack>
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
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Card>
  );
};

export default VotingItems;
