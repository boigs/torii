import { useRef } from 'react';

import {
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

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
  const initialFocus = useRef(null);

  return (
    <Modal
      isOpen={isOpen ?? false}
      onClose={() => onClose?.()}
      initialFocusRef={initialFocus}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Empty fields</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingTop={0} paddingBottom={0}>
          <Divider marginBottom='12px' />

          <Text align='justify'>
            You have left some fields blank. Are you sure you would like to
            submit these as part of your entry?
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
              ref={initialFocus}
            >
              Submit
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
