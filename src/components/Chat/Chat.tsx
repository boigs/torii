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
  VStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import _ from 'lodash';

import { validateNonEmpty } from 'src/helpers/formValidators';

import Message from './Message';

import styles from './Chat.module.scss';

export type Message = {
  sender: string;
  content: string;
};

type ChatProps = {
  messages: Message[];
  onSubmit: (text: string) => Promise<void>;
  className?: string;
};

type FormValues = {
  text: string;
};

const Chat: React.FC<ChatProps> = ({ messages, onSubmit, className }) => {
  const [isSendingChatMessage, setSendingChatMessage] = useState(false);

  const onFormSubmit = async (values: FormValues) => {
    const { text } = values;
    setSendingChatMessage(true);
    await onSubmit(text);
    setSendingChatMessage(false);
    values.text = '';
  };

  return (
    <Card size='sm' className={className}>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Chat
        </Heading>
        <Divider marginTop={'12px'} />
      </CardHeader>
      <CardBody className={styles.chatBody}>
        <div className={styles.chatMessages}>
          <VStack className={styles.messages}>
            {messages.map(({ sender, content }) => (
              <>
                <Message key={_.uniqueId()} sender={sender} content={content} />
                <Divider className={styles.messageDivider} />
              </>
            ))}
          </VStack>
        </div>
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
