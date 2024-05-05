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
import { Player, Round } from 'src/domain';

import styles from './VotingSummary.module.scss';

interface VotingSummaryProps {
  player: Player;
  players: Player[];
  round: Round;
  onAcceptButtonClicked: () => void;
  className?: string;
}

const VotingSummary = ({
  player,
  players,
  round,
  onAcceptButtonClicked,
  className,
}: VotingSummaryProps) => {
  const playersExceptCurrentVotingItem = players.filter(
    (player) => player !== round.getVotingItem().player,
  );
  const haveAllPlayersVoted = round.haveAllPlayersVoted(players);

  return (
    <Card header={<Text>Voting Summary</Text>} className={className}>
      <Text className={styles.votingDescriptionText}>
        This is what other players are casting as their vote:
      </Text>
      <List className={styles.votingWordsList}>
        {playersExceptCurrentVotingItem.map((player) => (
          <ListItem key={player.nickname} className={styles.votingWord}>
            <Flex className={styles.votingWordLine}>
              <PlayerComponent
                player={player}
                // The crown in this component does not look good as it makes it look like the spacing between items is inconsistent
                crownClassName={styles.hiddenCrown}
              />
              {!round.hasPlayerVoted(player) ? (
                <Tooltip placement='left' hasArrow label='Waiting for vote'>
                  <Center>
                    <Spinner size='md' />
                  </Center>
                </Tooltip>
              ) : round.getPlayerVotingWord(player) === null ? (
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
                <Text>{round.getPlayerVotingWord(player)}</Text>
              )}
            </Flex>
          </ListItem>
        ))}
      </List>
      {player.isHost && (
        <Tooltip
          hasArrow
          label={
            haveAllPlayersVoted
              ? undefined
              : 'Please wait until all players cast their vote'
          }
        >
          <Button
            colorScheme='blue'
            className={styles.acceptBallotButton}
            onClick={onAcceptButtonClicked}
            isDisabled={!haveAllPlayersVoted}
          >
            Accept
          </Button>
        </Tooltip>
      )}
    </Card>
  );
};

export default VotingSummary;
