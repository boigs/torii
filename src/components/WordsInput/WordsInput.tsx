import { useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Field, Form, Formik, FormikProps } from 'formik';
import _ from 'lodash';

import CustomCard from 'src/components/Card';

import ConfirmModal from './ConfirmModal';

import styles from './WordsInput.module.scss';

interface WordInputProps {
  word: string;
  onSubmit: (words: string[]) => Promise<void>;
  className?: string;
}

type FormValues = Record<string, string>;

const NUM_INPUTS = 8;

function WordInput({ word, onSubmit, className }: WordInputProps) {
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

  return isDoneSubmitting ? (
    <CustomCard header='Cool 😎'>
      <VStack>
        <Text align='center'>
          Great! Please wait while the rest of the players finish their
          submissions.
        </Text>
        <Spinner
          thickness='4px'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
          speed='1.75s'
        />
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
                const handler = async () => await onModalSubmit(props);
                handler().catch((error) => console.error(error));
              }}
            />
          </>
        )}
      </Formik>
    </Card>
  );
}

export default WordInput;
