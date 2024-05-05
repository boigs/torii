import React, { ReactNode } from 'react';

import {
  Modal as ChakraModal,
  ModalBody as ChakraModalBody,
  ModalFooter as ChakraModalFooter,
  ModalHeader as ChakraModalHeader,
  Divider,
  HStack,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';

import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen?: boolean;
  showCloseButton?: boolean;
  children?: ReactNode;
  onClose?: () => void;
}

export interface ModalSectionProps {
  className?: string;
}

const ModalHeader = ({
  children,
  className,
}: React.PropsWithChildren<ModalSectionProps>) => (
  <div className={className}>{children}</div>
);

const ModalBody = ({
  children,
  className,
}: React.PropsWithChildren<ModalSectionProps>) => (
  <div className={className}>{children}</div>
);

const ModalFooter = ({
  children,
  className,
}: React.PropsWithChildren<ModalSectionProps>) => (
  <HStack className={className}>{children}</HStack>
);

const Modal = ({
  isOpen,
  showCloseButton,
  children,
  onClose,
}: React.PropsWithChildren<ModalProps>) => {
  const header = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === ModalHeader
  );

  const body = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === ModalBody
  );

  const footer = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === ModalFooter
  );

  return (
    <ChakraModal isOpen={isOpen ?? false} onClose={() => onClose?.()}>
      <ModalOverlay />
      <ModalContent>
        {header && <ChakraModalHeader>{header}</ChakraModalHeader>}
        {showCloseButton ? <ModalCloseButton /> : null}

        {body && (
          <ChakraModalBody className={styles.modalBody}>
            <Divider marginBottom='12px' />
            {body}
          </ChakraModalBody>
        )}

        {body && <ChakraModalFooter>{footer}</ChakraModalFooter>}
      </ModalContent>
    </ChakraModal>
  );
};

export { Modal, ModalHeader, ModalBody, ModalFooter };
