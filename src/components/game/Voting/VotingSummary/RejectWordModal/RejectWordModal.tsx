import { Button, Text } from '@chakra-ui/react';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'src/components/shared/Modal';
import Player from 'src/domain/player';
import VotingItem from 'src/domain/votingItem';

import styles from './RejectWordModal.module.scss';

interface RejectWordModalProps {
  player: Player;
  word: string;
  votingItem: VotingItem;
  isOpen?: boolean;
  isSubmitting?: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
}

const RejectWordModal = ({
  player,
  word,
  votingItem,
  isOpen,
  isSubmitting,
  onSubmit,
  onClose,
}: RejectWordModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <ModalHeader>Reject matched word</ModalHeader>
      <ModalBody className={styles.modalBody}>
        <Text>
          Are you sure you would like to reject the word <b>{word}</b> submitted
          as a match by <b>{player.nickname}</b>?
        </Text>
        <Text>
          This player will not be able to submit this word again as a match for{' '}
          <b>{votingItem.word}</b>.
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          colorScheme='red'
          isLoading={isSubmitting}
          onClick={() => onSubmit?.()}
        >
          Reject
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RejectWordModal;
