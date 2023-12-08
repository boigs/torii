import React, { Fragment, useEffect, useRef } from 'react';

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

import { Player } from 'src/domain';
import { validateNonEmpty } from 'src/helpers/formValidators';

import Message from './Message';

import styles from './Chat.module.scss';

export type Message = {
  sender: string;
  content: string;
};

type ChatProps = {
  messages: Message[];
  players: Player[];
  onSubmit: (text: string) => Promise<void>;
  className?: string;
};

type FormValues = {
  text: string;
};

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef}></div>;
};

const Chat: React.FC<ChatProps> = ({
  messages,
  players,
  onSubmit,
  className,
}) => {
  const onFormSubmit = async (values: FormValues) => {
    const { text } = values;
    await onSubmit(text);
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
              <Fragment key={_.uniqueId()}>
                <Message
                  sender={
                    players.find((player) => player.nickname === sender) ?? {
                      nickname: sender,
                      isHost: false,
                      isConnected: true,
                    }
                  }
                  content={content}
                />
                <Divider className={styles.messageDivider} />
              </Fragment>
            ))}
            <AlwaysScrollToBottom />
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
            <Form className={styles.chatForm}>
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
                  isLoading={props.isSubmitting}
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
