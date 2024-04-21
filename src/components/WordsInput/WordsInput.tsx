import { useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Field, Form, Formik, FormikProps } from 'formik';
import _ from 'lodash';
import Image from 'next/image';

import CustomCard from 'src/components/Card';
import Spinner from 'src/components/Spinner';
import { Player, Round } from 'src/domain';
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
    {}
  );
  const word = round.word;
  const areWordsValid = !!round.playerWords[player.nickname] ?? false;

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

  return isDoneSubmitting && areWordsValid ? (
    <CustomCard
      header={
        <Center gap='4px'>
          <div>Done</div>
          <Image
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
          Please wait while the rest of the players finish their submissions.
        </Text>
        <Spinner />
      </VStack>
    </CustomCard>
  ) : (
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
        {(props: FormikProps<FormValues>) => (
          <>
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
                  isLoading={props.isSubmitting && !isEmptyFieldsModalOpen}
                  colorScheme='blue'
                  variant='solid'
                  size='md'
                  width='full'
                >
                  Submit
                </Button>
              </CardFooter>
            </Form>

            <ConfirmModal
              isOpen={isEmptyFieldsModalOpen}
              isSubmitting={props.isSubmitting}
              onClose={closeEmptyFieldsModal}
              onSubmit={() => {
                onModalSubmit(props).catch((error) =>
                  logger.error(error, 'ConfirmModal submit')
                );
              }}
            />
          </>
        )}
      </Formik>
    </Card>
  );
};

export default WordsInput;
