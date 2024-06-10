import { useEffect, useRef, useState } from 'react';

import {
  Button,
  Center,
  Flex,
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
import PlayerComponent from 'src/components/shared/JoinedPlayersList/PlayerList/Player';
import Spinner from 'src/components/shared/Spinner';
import Player from 'src/domain/player';
import Round from 'src/domain/round';
import useTimer from 'src/hooks/useTimer';
import logger from 'src/logger';

import ConfirmModal from './ConfirmModal';

import styles from './WordsInput.module.scss';

const NUM_INPUTS = 8;

type FormValues = Record<string, string>;

interface WordInputProps {
  player: Player;
  players: Player[];
  round: Round;
  onSubmit: (words: string[]) => Promise<void>;
  className?: string;
}

const parseFormValues = (values: FormValues) => {
  return Object.entries(values)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .map(([_, word]) => word);
};

const padZeros = (value: number) => {
  return value.toString().padStart(2, '0');
};

const WordsInput = ({
  player,
  players,
  round,
  onSubmit,
  className,
}: WordInputProps) => {
  const [isDoneSubmitting, setDoneSubmitting] = useState(false);
  const {
    isOpen: isEmptyFieldsModalOpen,
    onOpen: openEmptyFieldsModal,
    onClose: closeEmptyFieldsModal,
  } = useDisclosure();
  const formRef = useRef<FormikProps<FormValues>>(null);

  const { minutes, seconds } = useTimer(2 * 60);

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
    const words = parseFormValues(formValues);

    // if there is an empty word
    if (words.includes('')) {
      openEmptyFieldsModal();
    } else {
      await onSubmit(words);
      setDoneSubmitting(true);
    }
  };

  const onModalSubmit = async (formikProps: FormikProps<FormValues>) => {
    const words = parseFormValues(formikProps.values);

    formikProps.setSubmitting(true);
    await onSubmit(words);
    closeEmptyFieldsModal();
    formikProps.setSubmitting(false);
    setDoneSubmitting(true);
  };

  useEffect(() => {
    if (
      minutes === 0 &&
      seconds === 0 &&
      !isDoneSubmitting &&
      formRef.current
    ) {
      const words = _.uniq(
        parseFormValues(formRef.current.values).map((w) => w.toLowerCase()),
      );
      onSubmit(words).catch(() => {
        logger.error({}, 'Submitting words');
      });
      setDoneSubmitting(true);
      closeEmptyFieldsModal();
    }
  }, [minutes, seconds, onSubmit, isDoneSubmitting, closeEmptyFieldsModal]);

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
          <Text size='sm'>
            Write the words that come to your mind for: <b>{round.word}</b>.
          </Text>
          <Text>
            {seconds !== 0 || minutes !== 0
              ? `Time left: ${padZeros(minutes)}:${padZeros(seconds)}`
              : "Time's up!"}
          </Text>
        </div>
        <Formik<FormValues>
          initialValues={initialValues}
          onSubmit={onFormSubmit}
          innerRef={formRef}
        >
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
                  Please wait while the rest of the
                  <br />
                  players finish their submissions.
                </Text>
                <Flex className={styles.submissionStatus}>
                  {players.map((p) => (
                    <Flex key={p.nickname} className={styles.submission}>
                      <PlayerComponent
                        player={p}
                        crownClassName={styles.hiddenCrown}
                      />
                      {round.hasPlayerSentWords(p) ? (
                        <img
                          style={{ marginBottom: '-2px', marginRight: '-2px' }}
                          src='/svg/check.svg'
                          alt='check'
                          width='30'
                          height='30'
                        />
                      ) : (
                        <div>
                          <Spinner size='md' className={styles.spinner} />
                        </div>
                      )}
                    </Flex>
                  ))}
                </Flex>
              </VStack>
            </Card>
          </Center>
        </div>
      ) : null}
    </Card>
  );
};

export default WordsInput;
