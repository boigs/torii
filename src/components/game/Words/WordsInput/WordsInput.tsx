import { useState } from 'react';

import {
  Button,
  Center,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';
import _ from 'lodash';

import Card from 'src/components/shared/Card';
import Spinner from 'src/components/shared/Spinner';
import Player from 'src/domain/player';
import Round from 'src/domain/round';
import logger from 'src/logger';

import ConfirmModal from './ConfirmModal';

import styles from './WordsInput.module.scss';

interface WordInputProps {
  player: Player;
  round: Round;
  onSubmit: (words: string[]) => Promise<void>;
  className?: string;
}

type FormValues = Record<string, string>;

const NUM_INPUTS = 8;

const WordsInput = ({ player, round, onSubmit, className }: WordInputProps) => {
  const [isDoneSubmitting, setDoneSubmitting] = useState(false);
  const {
    isOpen: isEmptyFieldsModalOpen,
    onOpen: openEmptyFieldsModal,
    onClose: closeEmptyFieldsModal,
  } = useDisclosure();
  const wordsIndexes = _.range(1, NUM_INPUTS + 1).map((number) => ({
    labelNumber: number,
    formName: `word${number}`,
  }));
  const initialValues = wordsIndexes.reduce(
    (accumulator, current) => ({ ...accumulator, [current.formName]: '' }),
    {},
  );
  const haveSentWordsSuccessfully =
    isDoneSubmitting && round.hasPlayerSentWords(player);

  const onFormSubmit = async (formValues: FormValues) => {
    const words = Object.entries(formValues)
      .sort(([key1], [key2]) => key1.localeCompare(key2))
      .map(([_, word]) => word);

    // if there is an empty word
    if (words.includes('')) {
      openEmptyFieldsModal();
    } else {
      await onSubmit(words);
      setDoneSubmitting(true);
    }
  };

  const onModalSubmit = async (formikProps: FormikProps<FormValues>) => {
    const words = Object.entries(formikProps.values)
      .sort(([key1], [key2]) => key1.localeCompare(key2))
      .map(([_, word]) => word);

    formikProps.setSubmitting(true);
    await onSubmit(words);
    closeEmptyFieldsModal();
    formikProps.setSubmitting(false);
    setDoneSubmitting(true);
  };

  return (
    <Card
      header='Word Board'
      className={classNames(className, styles.wordsInputCard)}
    >
      <div
        className={classNames(
          styles.cardContent,
          haveSentWordsSuccessfully ? styles.cardContentDone : null,
        )}
      >
        <div className={styles.instructions}>
          <Text align='center' size='sm'>
            Write the words that come to your mind for:{' '}
            <span className={styles.chosenWord}>{round.word}</span>
          </Text>
        </div>
        <Formik initialValues={initialValues} onSubmit={onFormSubmit}>
          {(props: FormikProps<FormValues>) => (
            <>
              <Form className={styles.body}>
                {wordsIndexes.map(({ formName, labelNumber }) => (
                  <FormControl key={labelNumber}>
                    <InputGroup>
                      <InputLeftAddon className={styles.wordInputLeftAddon}>
                        {labelNumber}.
                      </InputLeftAddon>
                      <Field
                        as={Input}
                        isDisabled={haveSentWordsSuccessfully}
                        name={formName}
                        placeholder='...'
                        autoComplete='off'
                        className={styles.wordInput}
                      />
                    </InputGroup>
                  </FormControl>
                ))}
                <Button
                  className={styles.sendButton}
                  isDisabled={haveSentWordsSuccessfully}
                  type='submit'
                  isLoading={props.isSubmitting && !isEmptyFieldsModalOpen}
                  colorScheme='blue'
                  variant='solid'
                  size='md'
                  width='full'
                >
                  Submit
                </Button>
              </Form>

              <ConfirmModal
                isOpen={isEmptyFieldsModalOpen}
                isSubmitting={props.isSubmitting}
                onClose={closeEmptyFieldsModal}
                onSubmit={() => {
                  onModalSubmit(props).catch((error: unknown) => {
                    logger.error(error, 'ConfirmModal submit');
                  });
                }}
              />
            </>
          )}
        </Formik>
      </div>
      {haveSentWordsSuccessfully ? (
        <div className={styles.cardOverlay}>
          <Center>
            <Card
              className={className}
              header={
                <Center gap='4px'>
                  <div>Done</div>
                  <img
                    style={{ marginBottom: '-2px' }}
                    src='/svg/check.svg'
                    alt='check'
                    width='24'
                    height='24'
                  />
                </Center>
              }
            >
              <VStack className={styles.pleaseWaitContainer}>
                <Text className={styles.pleaseWaitText}>
                  Please wait while the rest of the players finish their
                  submissions.
                </Text>
                <Spinner />
              </VStack>
            </Card>
          </Center>
        </div>
      ) : null}
    </Card>
  );
};

export default WordsInput;
