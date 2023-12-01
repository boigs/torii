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
  onSubmit: (word: string) => Promise<void>;
  className?: string;
};

const NUM_INPUTS = 8;

const WordInput: React.FC<WordInputProps> = ({ word, onSubmit, className }) => {
  const [isSendingWordsMessage, setSendingWordsMessage] = useState(false);

  const initialValues = _.range(1, NUM_INPUTS + 1)
    .map((index) => `word${index}`)
    .reduce((accumulator, current) => ({ ...accumulator, [current]: '' }), {});

  const onFormSubmit = async (values: any) => {
    console.log(values);
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
              {_.range(1, NUM_INPUTS + 1).map((index) => (
                <FormControl key={index}>
                  <InputGroup>
                    <InputLeftAddon className={styles.wordInputLeftAddon}>
                      {index}.
                    </InputLeftAddon>
                    <Field
                      as={Input}
                      id={`word${index}`}
                      name={`word${index}`}
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
  );
};

export default WordInput;
