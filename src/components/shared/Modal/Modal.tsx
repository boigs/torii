import React, { ReactNode, useRef } from 'react';

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
import classNames from 'classnames';

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
  const nullRef = useRef(null);

  const header = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === ModalHeader,
  );

  const body = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === ModalBody,
  );

  const footer = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === ModalFooter,
  );

  return (
    <ChakraModal
      isOpen={isOpen ?? false}
      onClose={() => onClose?.()}
      finalFocusRef={nullRef}
    >
      <ModalOverlay />
      <ModalContent>
        {header && (
          <ChakraModalHeader className={styles.modalHeader}>
            {header}
            {showCloseButton ? (
              <ModalCloseButton className={styles.closeButton} />
            ) : null}
          </ChakraModalHeader>
        )}

        {body && (
          <ChakraModalBody
            className={classNames(
              styles.modalBody,
              !footer ? styles.modalBodyPadding : null,
            )}
          >
            <Divider marginBottom='12px' />
            {body}
          </ChakraModalBody>
        )}

        {footer && (
          <ChakraModalFooter className={styles.modalFooter}>
            {footer}
          </ChakraModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
};

export { Modal, ModalHeader, ModalBody, ModalFooter };
