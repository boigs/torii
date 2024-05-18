import { Button, Center, Flex, List, ListItem, Text } from '@chakra-ui/react';

import Card from 'src/components/shared/Card';
import PlayerComponent from 'src/components/shared/JoinedPlayersList/PlayerList/Player';
import Player from 'src/domain/player';
import Round from 'src/domain/round';

import styles from './Scoreboard.module.scss';

interface GameEndedProps {
  player: Player;
  players: Player[];
  rounds: Round[];
  onStartNewGameClicked: () => void;
  className?: string;
}

const calculateRoundScore = (player: Player, round: Round) => {
  return round
    .getPlayerWords(player)
    .reduce((score, word) => score + word.score, 0);
};

const calculateScore = (player: Player, rounds: Round[]) => {
  return rounds.reduce(
    (score, round) => score + calculateRoundScore(player, round),
    0,
  );
};

const Scoreboard = ({
  player,
  players,
  rounds,
  onStartNewGameClicked,
  className,
}: GameEndedProps) => {
  const scores = players.map((player) => ({
    player,
    score: calculateScore(player, rounds),
  }));

  const sortedPlayers = [...scores].sort((a, b) => {
    const scoreDiff = a.score - b.score;
    return scoreDiff === 0
      ? players.indexOf(a.player) - players.indexOf(b.player)
      : scoreDiff;
  });

  const highestScore = sortedPlayers[0].score;
  const winners = sortedPlayers.filter(({ score }) => score === highestScore);

  return (
    <Card header='Scoreboard' className={className}>
      <Text className={styles.description}>
        {winners.length === 1
          ? `${winners[0].player.nickname} wins!`
          : `It's a draw! There are ${winners.length} winners!`}
      </Text>
      <List className={styles.scoreboardList}>
        {sortedPlayers.map(({ player, score }, index) => (
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
                <Text>{score}</Text>
              </Center>
            </Flex>
          </ListItem>
        ))}
        {player.isHost ? (
          <Button
            onClick={onStartNewGameClicked}
            colorScheme='blue'
            className={styles.startNewGameButton}
          >
            Start new game
          </Button>
        ) : null}
      </List>
    </Card>
  );
};

export default Scoreboard;
