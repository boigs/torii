import React, { useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import _ from 'lodash';

import styles from './WordsInput.module.scss';

type WordInputProps = {
  word: string;
  onSubmit: (words: string[]) => Promise<void>;
  className?: string;
};

const NUM_INPUTS = 8;

const WordInput: React.FC<WordInputProps> = ({ word, onSubmit, className }) => {
  const {
    isOpen: isEmptyFieldsModalOpen,
    onOpen: openEmptyFieldsModal,
    onClose: closeEmptyFieldsModal,
  } = useDisclosure();
  const [submissionWords, setSubmissionWords] = useState<string[]>([]);

  const wordsIndexes = _.range(1, NUM_INPUTS + 1).map((number) => ({
    labelNumber: number,
    formName: `word${number}`,
  }));
  const initialValues = wordsIndexes.reduce(
    (accumulator, current) => ({ ...accumulator, [current.formName]: '' }),
    {}
  );

  const onFormSubmit = async (formValues: object) => {
    const words = Object.entries(formValues)
      .sort(([key1], [key2]) => key1.localeCompare(key2))
      .map(([_, word]) => word);

    setSubmissionWords(words);

    // if there is an empty word
    if (words.includes('')) {
      openEmptyFieldsModal();
    } else {
      await onSubmit(words);
    }
  };

  const onModalSubmit = async () => {
    await onSubmit(submissionWords);
    closeEmptyFieldsModal();
  };

  return (
    <>
      <Card size='sm' className={className}>
        <CardHeader>
          <Heading as='h3' textAlign='center' size='md'>
            Be Unoriginal!
          </Heading>
          <Divider marginTop='12px' marginBottom='12px' />
          <div className={styles.instructions}>
            <Text align='center' size='sm'>
              Write the words that come to your mind for:
            </Text>
            <Text className={styles.chosenWord}>{word}</Text>
          </div>
        </CardHeader>
        <Formik initialValues={initialValues} onSubmit={onFormSubmit}>
          {(props) => (
            <Form>
              <CardBody className={styles.body}>
                {wordsIndexes.map(({ formName, labelNumber }) => (
                  <FormControl key={labelNumber}>
                    <InputGroup>
                      <InputLeftAddon className={styles.wordInputLeftAddon}>
                        {labelNumber}.
                      </InputLeftAddon>
                      <Field
                        as={Input}
                        name={formName}
                        placeholder='...'
                        autoComplete='off'
                        className={styles.wordInput}
                      />
                    </InputGroup>
                  </FormControl>
                ))}
              </CardBody>
              <CardFooter>
                <Button
                  className={styles.sendButton}
                  type='submit'
                  isLoading={props.isSubmitting}
                  colorScheme='blue'
                  variant='solid'
                  size='md'
                  width='full'
                >
                  Submit
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>

      <Modal isOpen={isEmptyFieldsModalOpen} onClose={closeEmptyFieldsModal}>
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
            <Divider marginTop='12px' />
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button onClick={closeEmptyFieldsModal}>Cancel</Button>
              <Button onClick={onModalSubmit} colorScheme='blue' size='md'>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WordInput;
