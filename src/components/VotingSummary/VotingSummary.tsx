import { Text } from '@chakra-ui/react';

import Card from 'src/components/Card';
import { Player, Round } from 'src/domain';

interface VotingSummaryProps {
  you: Player;
  players: Player[];
  round: Round;
}

const VotingSummary = ({ you, players, round }: VotingSummaryProps) => {
  return <Card header={<Text>Voting Summary</Text>}></Card>;
};

export default VotingSummary;
