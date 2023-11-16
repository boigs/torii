import React, { useState } from 'react';

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
  Textarea,
} from '@chakra-ui/react';
import { Field, Form, Formik, FormikProps } from 'formik';

import { validateNonEmpty } from 'src/helpers/formValidators';

import styles from './Chat.module.scss';

export type Message = {
  sender: string;
  content: string;
};

type ChatProps = {
  messages: Message[];
  onSubmit: (text: string) => Promise<void>;
};

type FormValues = {
  text: string;
};

const Chat: React.FC<ChatProps> = ({ messages, onSubmit }) => {
  const [isSendingChatMessage, setSendingChatMessage] = useState(false);

  const onFormSubmit = async (values: FormValues) => {
    const { text } = values;
    setSendingChatMessage(true);
    await onSubmit(text);
    setSendingChatMessage(false);
    values.text = '';
  };

  return (
    <Card size='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Game chat
        </Heading>
        <Divider marginTop={'12px'} />
      </CardHeader>
      <CardBody className={styles.chatBody}>
        <Textarea
          readOnly={true}
          resize='none'
          height={150}
          value={messages
            .map(({ sender, content }) => `${sender}: ${content}`)
            .join('\n')}
        />
      </CardBody>
      <CardFooter>
        <Formik
          initialValues={{
            text: '',
          }}
          onSubmit={onFormSubmit}
        >
          {(props) => (
            <Form>
              <Flex className={styles.chatControls}>
                <FormControl>
                  <Field
                    as={Input}
                    id='text'
                    name='text'
                    placeholder=''
                    autoComplete='off'
                    validate={(value: string) =>
                      validateNonEmpty(value, 'Text')
                    }
                  />
                </FormControl>
                <Button
                  className={styles.sendButton}
                  type='submit'
                  isLoading={isSendingChatMessage}
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

export default Chat;
