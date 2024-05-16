import { Button, Flex, List, ListItem } from '@chakra-ui/react';

import Card from 'src/components/shared/Card';
import PlayerComponent from 'src/components/shared/JoinedPlayersList/PlayerList/Player';
import Player from 'src/domain/player';
import Round from 'src/domain/round';

import styles from './Scoreboard.module.scss';

interface GameEndedProps {
  className?: string;
  players: Player[];
  rounds: Round[];
}

const Scoreboard = ({ players, rounds, className }: GameEndedProps) => {
  const calculateRoundScore = (player: Player, round: Round) => {
    return round
      .getPlayerWords(player)
      .reduce((score, word) => score + word.score, 0);
  };

  const calculateScore = (player: Player) => {
    return rounds.reduce(
      (score, round) => score + calculateRoundScore(player, round),
      0,
    );
  };

  return (
    <Card header='Scoreboard' className={className}>
      <List className={styles.leaderBoardList}>
        {players
          .sort((a, b) => calculateScore(a) - calculateScore(b))
          .map((player) => (
            <ListItem key={player.nickname} className={styles.scoreRow}>
              <Flex className={styles.scoreContainer}>
                <PlayerComponent
                  player={player}
                  crownClassName={styles.hiddenCrown}
                />
                <Button colorScheme='blue'>{calculateScore(player)}</Button>
              </Flex>
            </ListItem>
          ))}
      </List>
    </Card>
  );
};

export default Scoreboard;
