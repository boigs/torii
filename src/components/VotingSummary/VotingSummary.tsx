import { CloseIcon } from '@chakra-ui/icons';
import { Button, CardBody, Flex, List, ListItem, Text } from '@chakra-ui/react';

import Card from 'src/components/Card';
import PlayerComponent from 'src/components/JoinedPlayersList/PlayerList/Player';
import { Player, Round } from 'src/domain';

import Spinner from '../Spinner';

import styles from './VotingSummary.module.scss';

interface VotingSummaryProps {
  you: Player;
  players: Player[];
  round: Round;
}

const VotingSummary = ({ you, players, round }: VotingSummaryProps) => {
  return (
    <Card header={<Text>Voting Summary</Text>}>
      <CardBody className={styles.votingSummaryContainer}>
        <Text className={styles.votingDescriptionText}>
          This is what other players are casting as their vote
        </Text>
        <List className={styles.votingWordsList}>
          {players.map((player) => (
            <ListItem key={player.nickname} className={styles.votingWord}>
              <Flex className={styles.votingWordLine}>
                <PlayerComponent
                  player={{
                    ...player,
                    // I don't want any crown shown in this component
                    isHost: false,
                  }}
                />
                {!(player.nickname in round.score.playerWordSubmission) ? (
                  <Spinner size='md' />
                ) : round.score.playerWordSubmission[player.nickname] ===
                  null ? (
                  <Text>
                    <CloseIcon color='blue.600' />
                  </Text>
                ) : (
                  <Text>
                    {round.score.playerWordSubmission[player.nickname]}
                  </Text>
                )}
              </Flex>
            </ListItem>
          ))}
        </List>
        {you.isHost && <Button>Submit</Button>}
      </CardBody>
    </Card>
  );
};

export default VotingSummary;
