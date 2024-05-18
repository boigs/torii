import { useState } from 'react';

import { Button, List, ListItem, Text } from '@chakra-ui/react';

import Card from 'src/components/shared/Card';
import Player from 'src/domain/player';
import Round from 'src/domain/round';

import { RoundScoreModal } from '../../Voting/RoundScore';

import styles from './RoundDetails.module.scss';

interface RoundSummaryProps {
  rounds: Round[];
  players: Player[];
  className?: string;
}

const RoundDetails = ({ rounds, players, className }: RoundSummaryProps) => {
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);

  return (
    <Card header='Round Details' className={className}>
      <Text className={styles.description}>
        Click to see the details of each round.
      </Text>
      <List className={styles.roundList}>
        {rounds.map((round) => (
          <ListItem key={round.index} className={styles.roundItem}>
            <Button
              colorScheme='blue'
              onClick={() => setSelectedRound(round)}
              className={styles.button}
            >
              Round {round.index + 1}
            </Button>
            <RoundScoreModal
              isOpen={selectedRound === round}
              onClose={() => setSelectedRound(null)}
              players={players}
              round={round}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default RoundDetails;
