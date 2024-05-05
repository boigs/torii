import { Button, HStack, Text } from '@chakra-ui/react';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'src/components/Modal';

export interface ConfirmModalProps {
  isOpen?: boolean;
  isSubmitting?: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
}

const ConfirmModal = ({
  isOpen,
  isSubmitting,
  onSubmit,
  onClose,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen ?? false} onClose={() => onClose?.()}>
      <ModalHeader>Empty fields</ModalHeader>
      <ModalBody>
        <Text align='justify'>
          You have left some fields blank. Are you sure you would like to submit
          these as part of your entry?
        </Text>
      </ModalBody>

      <ModalFooter>
        <HStack>
          <Button onClick={() => onClose?.()}>Cancel</Button>
          <Button
            onClick={() => onSubmit?.()}
            colorScheme='blue'
            size='md'
            isLoading={isSubmitting}
          >
            Submit
          </Button>
        </HStack>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
