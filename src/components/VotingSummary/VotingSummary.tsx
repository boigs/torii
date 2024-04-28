import {
  Button,
  CardBody,
  Center,
  Flex,
  List,
  ListItem,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import Image from 'next/image';

import Card from 'src/components/Card';
import PlayerComponent from 'src/components/JoinedPlayersList/PlayerList/Player';
import { Player, Round } from 'src/domain';

import Spinner from '../Spinner';

import styles from './VotingSummary.module.scss';

interface VotingSummaryProps {
  you: Player;
  players: Player[];
  round: Round;
  className?: string;
}

const VotingSummary = ({
  you,
  players,
  round,
  className,
}: VotingSummaryProps) => {
  const playersExceptCurrentScorePlayer = players.filter(
    ({ nickname }) => nickname !== round.score.currentPlayer
  );

  return (
    <Card header={<Text>Voting Summary</Text>} className={className}>
      <CardBody className={styles.votingSummaryContainer}>
        <Text className={styles.votingDescriptionText}>
          This is what other players are casting as their vote
        </Text>
        <List className={styles.votingWordsList}>
          {playersExceptCurrentScorePlayer.map((player) => (
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
                  <Tooltip placement='left' hasArrow label='Waiting for vote'>
                    <Center>
                      <Spinner size='md' />
                    </Center>
                  </Tooltip>
                ) : round.score.playerWordSubmission[player.nickname] ===
                  null ? (
                  <Tooltip placement='left' hasArrow label='Skipped'>
                    <span className={styles.skippedCross}>
                      <Image
                        src='/svg/cross.svg'
                        alt='skipped'
                        width='20'
                        height='20'
                      />
                    </span>
                  </Tooltip>
                ) : (
                  <Text>
                    {round.score.playerWordSubmission[player.nickname]}
                  </Text>
                )}
              </Flex>
            </ListItem>
          ))}
        </List>
        {you.isHost && (
          <Button colorScheme='blue' className={styles.acceptBallotButton}>
            Accept
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default VotingSummary;
