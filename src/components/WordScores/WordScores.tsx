import {
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import classNames from 'classnames';

import Card from 'src/components/Card';
import { Modal, ModalBody, ModalHeader } from 'src/components/Modal';
import { Player, Round, Word } from 'src/domain';

import styles from './WordScores.module.scss';

interface WordScoresProps {
  player: Player;
  round: Round;
  className?: string;
}

interface WordScoresModalProps extends Omit<WordScoresProps, 'className'> {
  isOpen: boolean;
  onClose: () => void;
}

const WordScores = ({ player, round }: WordScoresProps) => {
  const words = round.getPlayerWords(player);

  const hasWordBeenUsed = (word: Word) => {
    return word.isUsed;
  };

  return (
    <VStack>
      {words.map((word, index) => (
        <Flex key={index} className={styles.scoreContainer}>
          <InputGroup>
            <InputLeftAddon className={styles.wordLeftAddon}>
              {index + 1}.
            </InputLeftAddon>
            <Input readOnly={true} className={styles.word} value={word.value} />
          </InputGroup>
          <Tooltip
            placement='right'
            hasArrow
            label={hasWordBeenUsed(word) ? undefined : 'Not used in a vote yet'}
          >
            <Center className={styles.score}>
              <Text>{hasWordBeenUsed(word) ? word.score : '-'}</Text>
            </Center>
          </Tooltip>
        </Flex>
      ))}
    </VStack>
  );
};

const WordScoresCard = ({ player, round, className }: WordScoresProps) => {
  return (
    <Card header='Score' className={className}>
      {round.getPlayerWords(player).length > 0 ? (
        <>
          <Text
            className={classNames(styles.description, styles.cardDescription)}
          >
            These are the words you submitted and their current score on the
            right.
          </Text>
          <WordScores player={player} round={round} />
        </>
      ) : (
        <Text className={styles.description}>
          It seems like you did not submit any words, so there is no score
          available.
        </Text>
      )}
    </Card>
  );
};

const WordScoresModal = ({
  player,
  round,
  isOpen,
  onClose,
}: WordScoresModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <ModalHeader>
        {player.nickname}&apos;s Words on Round {round.index + 1}
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        {round.getPlayerWords(player).length > 0 ? (
          <WordScores player={player} round={round} />
        ) : (
          <Text className={styles.description}>No words were submitted.</Text>
        )}
      </ModalBody>
    </Modal>
  );
};

export { WordScoresModal, WordScoresCard };
