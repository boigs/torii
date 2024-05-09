import { useState } from 'react';

import { Button, Flex, List, ListItem, Text } from '@chakra-ui/react';

import Card from 'src/components/Card';
import PlayerComponent from 'src/components/JoinedPlayersList/PlayerList/Player';
import { Modal, ModalBody, ModalHeader } from 'src/components/Modal';
import { WordScoresModal } from 'src/components/WordScores';
import { Player, Round } from 'src/domain';

import styles from './RoundScore.module.scss';

type Nickname = string;

interface RoundScoreProps {
  players: Player[];
  round: Round;
  className?: string;
}

interface RoundScoreModalProps extends Omit<RoundScoreProps, 'className'> {
  isOpen: boolean;
  onClose: () => void;
}

const calculateScore = (player: Player, round: Round) => {
  return round
    .getPlayerWords(player)
    .reduce((sum, word) => sum + word.score, 0);
};

const RoundScore = ({ players, round }: RoundScoreProps) => {
  const [modalsOpened, setModalsOpened] = useState<Record<Nickname, boolean>>(
    {},
  );

  const setOpened = (player: Player, isOpen: boolean) => {
    setModalsOpened({ ...modalsOpened, [player.nickname]: isOpen });
  };

  const isOpen = (player: Player) => modalsOpened[player.nickname];

  return (
    <>
      <Text className={styles.scoreDescription}>
        Players&apos; points for: {round.word}.
      </Text>
      <List className={styles.scoresList}>
        {players.map((player) => (
          <ListItem key={player.nickname} className={styles.scoreRow}>
            <Flex className={styles.scoreContainer}>
              <PlayerComponent
                player={player}
                crownClassName={styles.hiddenCrown}
              />
              <Button
                colorScheme='blue'
                onClick={() => setOpened(player, true)}
              >
                {calculateScore(player, round)}
              </Button>
            </Flex>
            <WordScoresModal
              isOpen={isOpen(player)}
              onClose={() => setOpened(player, false)}
              round={round}
              player={player}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

const RoundScoreCard = ({ players, round }: RoundScoreProps) => {
  return (
    <Card header={`Round ${round.index + 1} Scores`}>
      <RoundScore players={players} round={round} />
    </Card>
  );
};

const RoundScoreModal = ({
  players,
  round,
  isOpen,
  onClose,
}: RoundScoreModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <ModalHeader>{`Round ${round.index + 1} Scores`}</ModalHeader>
      <ModalBody>
        <RoundScore players={players} round={round} />
      </ModalBody>
    </Modal>
  );
};

export { RoundScoreCard, RoundScoreModal };
