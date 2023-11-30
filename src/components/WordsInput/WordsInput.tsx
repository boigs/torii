import { useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

import { validateNonEmpty } from 'src/helpers/formValidators';

import styles from './WordsInput.module.scss';

type WordInputProps = {
  word: string;
  onSubmit: (word: string) => Promise<void>;
  className?: string;
};

type FormValues = {
  word: string;
};

const WordInput: React.FC<WordInputProps> = ({ word, onSubmit, className }) => {
  const [isSendingWordsMessage, setSendingWordsMessage] = useState(false);

  const onFormSubmit = async (values: FormValues) => {
    const { word } = values;
    setSendingWordsMessage(true);
    await onSubmit(word);
    setSendingWordsMessage(false);
    values.word = '';
  };

  return (
    <Card size='sm' className={className}>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Enter your word for: {word}
        </Heading>
        <Divider marginTop={'12px'} />
      </CardHeader>
      <CardBody className={styles.chatBody}>
        <div className={styles.chatMessages}>
          <VStack className={styles.messages}></VStack>
        </div>
      </CardBody>
      <CardFooter>
        <Formik
          initialValues={{
            word: '',
          }}
          onSubmit={onFormSubmit}
        >
          {(props) => (
            <Form className={styles.chatForm}>
              <Flex className={styles.chatControls}>
                <FormControl>
                  <Field
                    as={Input}
                    id='word'
                    name='word'
                    placeholder=''
                    autoComplete='off'
                    validate={(value: string) =>
                      validateNonEmpty(value, 'Word')
                    }
                  />
                </FormControl>
                <Button
                  className={styles.sendButton}
                  type='submit'
                  isLoading={isSendingWordsMessage}
                  colorScheme='blue'
                  variant='solid'
                  size='md'
                  width='full'
                >
                  Send
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </CardFooter>
    </Card>
  );
};

export default WordInput;
