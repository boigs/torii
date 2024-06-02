import { useEffect, useState } from 'react';

import {
  Button,
  Center,
  Flex,
  List,
  ListItem,
  Text,
  Tooltip,
} from '@chakra-ui/react';

import Card from 'src/components/shared/Card';
import PlayerComponent from 'src/components/shared/JoinedPlayersList/PlayerList/Player';
import Spinner from 'src/components/shared/Spinner';
import Player from 'src/domain/player';
import Round from 'src/domain/round';

import RejectWordModal from './RejectWordModal';

import styles from './VotingSummary.module.scss';

interface VotingSummaryProps {
  player: Player;
  players: Player[];
  round: Round;
  onAcceptButtonClicked: () => void;
  onWordRejected: (player: Player, word: string) => void;
  className?: string;
}

const VotingSummary = ({
  player,
  players,
  round,
  onAcceptButtonClicked,
  onWordRejected,
  className,
}: VotingSummaryProps) => {
  const [acceptButtonEnabled, setAcceptButtonEnabled] = useState(false);
  const [playerToReject, setPlayerToReject] = useState<Player | null>(null);

  const playersExceptCurrentVotingItem = players.filter(
    (player) => player !== round.getVotingItem().player,
  );
  const haveAllPlayersVoted = round.haveAllPlayersVoted(players);

  useEffect(() => {
    setTimeout(() => setAcceptButtonEnabled(true), 5000);
  }, []);

  const onAcceptClicked = () => {
    setAcceptButtonEnabled(false);
    onAcceptButtonClicked();
    setTimeout(() => setAcceptButtonEnabled(true), 5000);
  };

  return (
    <Card header='Matching Summary' className={className}>
      <Text className={styles.votingDescriptionText}>
        This is what other players have submitted as their match:
      </Text>
      <List className={styles.votingWordsList}>
        {playersExceptCurrentVotingItem.map((p) => (
          <ListItem key={p.nickname} className={styles.votingWord}>
            <Flex className={styles.votingWordLine}>
              <PlayerComponent
                player={p}
                // The crown in this component does not look good as it makes it look like the spacing between items is inconsistent
                crownClassName={styles.hiddenCrown}
              />
              {!round.hasPlayerVoted(p) ? (
                <Tooltip placement='left' hasArrow label='Waiting for vote'>
                  <Center>
                    <Spinner size='md' />
                  </Center>
                </Tooltip>
              ) : round.getPlayerVotingWord(p) === null ? (
                <Tooltip placement='left' hasArrow label='Skipped'>
                  <span className={styles.skippedCross}>
                    <img
                      src='/svg/cross.svg'
                      alt='skipped'
                      width='20'
                      height='20'
                    />
                  </span>
                </Tooltip>
              ) : (
                <Flex className={styles.wordContainer}>
                  <Text>{round.getPlayerVotingWord(player)}</Text>
                  <Button
                    size='xs'
                    colorScheme='red'
                    variant='ghost'
                    className={styles.rejectButton}
                    onClick={() => setPlayerToReject(player)}
                  >
                    <img
                      src='/svg/block.svg'
                      alt='reject'
                      className={styles.rejectIcon}
                    />
                  </Button>
                </Flex>
              )}
            </Flex>
          </ListItem>
        ))}
      </List>
      {player.isHost && (
        <Tooltip
          hasArrow
          label={
            haveAllPlayersVoted || acceptButtonEnabled
              ? undefined
              : 'Please wait until all players have submitted a match'
          }
        >
          <Button
            colorScheme='blue'
            className={styles.acceptBallotButton}
            onClick={onAcceptClicked}
            isDisabled={!haveAllPlayersVoted && !acceptButtonEnabled}
          >
            Accept
          </Button>
        </Tooltip>
      )}
      <RejectWordModal
        player={playerToReject}
        word={playerToReject ? round.getPlayerVotingWord(playerToReject) : null}
        votingItem={round.getVotingItem()}
        isOpen={playerToReject !== null}
        onClose={() => setPlayerToReject(null)}
        onReject={onWordRejected}
      />
    </Card>
  );
};

export default VotingSummary;
