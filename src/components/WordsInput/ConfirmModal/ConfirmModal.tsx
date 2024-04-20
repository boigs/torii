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

export type ConfirmModalProps = {
  isOpen?: boolean;
  isSubmitting?: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  isSubmitting,
  onSubmit,
  onClose,
}) => (
  <Modal isOpen={isOpen ?? false} onClose={() => onClose?.()}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Empty fields</ModalHeader>
      <ModalCloseButton />
      <ModalBody paddingTop={0} paddingBottom={0}>
        <Divider marginBottom='12px' />

        <Text align='justify'>
          You have left some fields blank. Are you sure you would like to submit
          these as part of your entry?
        </Text>
        <Divider marginTop='12px' />
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
    </ModalContent>
  </Modal>
);

export default ConfirmModal;
