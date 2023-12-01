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
  Text,
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
  const [isSendingWordsMessage, setSendingWordsMessage] = useState(false);

  const wordsIndexes = _.range(1, NUM_INPUTS + 1).map((position) => ({
    position,
    key: `word${position}`,
  }));
  const initialValues = wordsIndexes.reduce(
    (accumulator, current) => ({ ...accumulator, [current.key]: '' }),
    {}
  );

  const onFormSubmit = async (formValues: object) => {
    setSendingWordsMessage(true);
    const formWords = new Map<string, string>(Object.entries(formValues));
    var words = wordsIndexes.map((index) => formWords.get(index.key)!);
    onSubmit(words);
    setSendingWordsMessage(false);
  };

  return (
    <Card size='sm' className={className}>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Be Unoriginal!
        </Heading>
        <Divider marginTop='12px' marginBottom='12px' />
        <div className={styles.instructions}>
          <Text>Write the words that come to your mind for:</Text>
          <Text className={styles.chosenWord}>{word}</Text>
        </div>
      </CardHeader>
      <Formik initialValues={initialValues} onSubmit={onFormSubmit}>
        {(props) => (
          <Form>
            <CardBody className={styles.body}>
              {wordsIndexes.map((index) => (
                <FormControl key={index.key}>
                  <InputGroup>
                    <InputLeftAddon className={styles.wordInputLeftAddon}>
                      {index.position}.
                    </InputLeftAddon>
                    <Field
                      as={Input}
                      id={index.key}
                      name={index.key}
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
                isLoading={isSendingWordsMessage}
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
  );
};

export default WordInput;
