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
  player: Player | null;
  word: string | null;
  votingItem: VotingItem;
  isOpen: boolean;
  onReject: (player: Player, word: string) => void;
  onClose: () => void;
}

const RejectWordModal = ({
  player,
  word,
  votingItem,
  isOpen,
  onReject: onReject,
  onClose,
}: RejectWordModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <ModalHeader>Reject matched word</ModalHeader>
      <ModalBody className={styles.modalBody}>
        {!player || !word ? (
          <>
            {/*
            Checking null values here is a far less ugly option
            than having to deal with null assertions in MatchingSummary.
            The API of Round#getPlayerVotingWord() would need to be changed
            in order to avoid this situation.
            */}
          </>
        ) : (
          <>
            <Text>
              Are you sure you would like to reject the word <b>{word}</b>{' '}
              submitted as a match by <b>{player.nickname}</b>?
            </Text>
            <Text>
              This player will not be able to submit this word again as a match
              for <b>{votingItem.word}</b>.
            </Text>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          colorScheme='red'
          onClick={() => {
            if (player && word) {
              onReject(player, word);
            }
          }}
        >
          Reject
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RejectWordModal;
