import { Center, Flex, List, ListItem, Text } from '@chakra-ui/react';

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

  const sortedPlayers = players.sort((a, b) => {
    const scoreDiff = calculateScore(b) - calculateScore(a);
    return scoreDiff === 0
      ? players.indexOf(a) - players.indexOf(b)
      : scoreDiff;
  });

  return (
    <Card header='Scoreboard' className={className}>
      <Text className={styles.description}>
        {sortedPlayers[0].nickname} wins!
      </Text>
      <List className={styles.scoreboardList}>
        {sortedPlayers.map((player, index) => (
          <ListItem key={player.nickname} className={styles.scoreRow}>
            <Flex className={styles.scoreContainer}>
              <Flex className={styles.scoreboardRank}>
                <Center className={styles.rank}>
                  <Text>{index + 1}.</Text>
                </Center>
                <PlayerComponent
                  player={player}
                  crownClassName={styles.hiddenCrown}
                />
              </Flex>
              <Center className={styles.score}>
                <Text> {calculateScore(player)}</Text>
              </Center>
            </Flex>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default Scoreboard;
