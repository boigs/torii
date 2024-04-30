import { Fragment, useEffect, useRef } from 'react';

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
import { Field, Form, Formik, FormikProps } from 'formik';
import _ from 'lodash';

import Player from 'src/domain/player';
import { validateNonEmpty } from 'src/helpers/formValidators';

import Message from './Message';

import styles from './Chat.module.scss';

export interface Message {
  sender: string;
  content: string;
}

interface ChatProps {
  messages: Message[];
  players: Player[];
  onSubmit: (text: string) => Promise<void>;
  className?: string;
}

interface FormValues {
  text: string;
}

const Chat = ({ messages, players, onSubmit, className }: ChatProps) => {
  const container = useRef<HTMLDivElement | null>(null);

  const scroll = () => {
    const element = container.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  useEffect(() => {
    scroll();
  }, [messages]);

  const onFormSubmit = async (values: FormValues) => {
    const { text } = values;
    values.text = '';
    await onSubmit(text);
  };

  return (
    <Card size='sm' className={className}>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Chat
        </Heading>
        <Divider marginTop='12px' />
      </CardHeader>
      <CardBody className={styles.chatBody}>
        <VStack className={styles.messages} ref={container}>
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
          <div />
        </VStack>
      </CardBody>
      <CardFooter>
        <Formik
          initialValues={{
            text: '',
          }}
          onSubmit={onFormSubmit}
        >
          {(props: FormikProps<FormValues>) => (
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
