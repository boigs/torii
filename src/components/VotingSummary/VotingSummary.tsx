import {
  Button,
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
import Spinner from 'src/components/Spinner';
import Player from 'src/domain/player';
import Round from 'src/domain/round';

import styles from './VotingSummary.module.scss';

interface VotingSummaryProps {
  you: Player;
  players: Player[];
  round: Round;
  onAcceptButtonClicked: () => void;
  className?: string;
}

const VotingSummary = ({
  you,
  players,
  round,
  onAcceptButtonClicked,
  className,
}: VotingSummaryProps) => {
  const playersExceptCurrentScorePlayer = players.filter(
    ({ nickname }) => nickname !== round.votingItem().nickname
  );

  return (
    <Card header={<Text>Voting Summary</Text>} className={className}>
      <Text className={styles.votingDescriptionText}>
        This is what other players are casting as their vote:
      </Text>
      <List className={styles.votingWordsList}>
        {playersExceptCurrentScorePlayer.map((player) => (
          <ListItem key={player.nickname} className={styles.votingWord}>
            <Flex className={styles.votingWordLine}>
              <PlayerComponent
                // I don't want any crown shown in this component
                player={new Player(player.nickname, false, player.isConnected)}
              />
              {!round.playerVoted(player.nickname) ? (
                <Tooltip placement='left' hasArrow label='Waiting for vote'>
                  <Center>
                    <Spinner size='md' />
                  </Center>
                </Tooltip>
              ) : round.playerVotingWord(player.nickname) === null ? (
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
                <Text>{round.playerVotingWord(player.nickname)}</Text>
              )}
            </Flex>
          </ListItem>
        ))}
      </List>
      {you.isHost && (
        <Button
          colorScheme='blue'
          className={styles.acceptBallotButton}
          onClick={onAcceptButtonClicked}
        >
          Accept
        </Button>
      )}
    </Card>
  );
};

export default VotingSummary;
