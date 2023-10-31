import React, { useContext, useEffect } from 'react';

import { Link } from '@chakra-ui/next-js';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { useSelector } from '@xstate/react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';

import { Context } from 'src/components/ContextProvider';
import { validateNonEmpty } from 'src/helpers/formValidators';

type JoinFormProps = {
  gameId?: string;
};

type FormValues = {
  gameId: string;
  nickname: string;
};

const JoinForm: React.FC<JoinFormProps> = ({ gameId }) => {
  const router = useRouter();
  const { gameFsm } = useContext(Context);
  var isDisconnected = useSelector(gameFsm, (state) =>
    state.matches('disconnected')
  );
  var isLobby = useSelector(gameFsm, (state) => state.matches('lobby'));

  useEffect(() => {
    if (isLobby) {
      router.push('/game');
    }
  }, [isLobby, router]);

  const onSubmit = async (values: FormValues) =>
    gameFsm.send({
      type: 'JOIN_GAME',
      value: { nickname: values.nickname, gameId: values.gameId },
    });

  return (
    <Card size='sm' width='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Join Game
        </Heading>
      </CardHeader>
      <Formik
        initialValues={{
          gameId: gameId ?? '',
          nickname: '',
        }}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form>
            <CardBody>
              <Flex flexDirection='column' gap='12px'>
                <Flex flexDirection='column' gap='8px'>
                  <FormControl
                    isInvalid={!!props.errors.gameId && props.touched.gameId}
                    hidden={!!gameId}
                  >
                    <Field
                      as={Input}
                      id='gameId'
                      name='gameId'
                      placeholder='Game id'
                      autoComplete='off'
                      validate={(value: string) =>
                        validateNonEmpty(value, 'Game id')
                      }
                    />
                    <FormErrorMessage>{props.errors.gameId}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      !!props.errors.nickname && props.touched.nickname
                    }
                  >
                    <Field
                      as={Input}
                      id='nickname'
                      name='nickname'
                      placeholder='Nickname'
                      autoComplete='off'
                      validate={(value: string) =>
                        validateNonEmpty(value, 'Nickname')
                      }
                    />
                    <FormErrorMessage>{props.errors.nickname}</FormErrorMessage>
                  </FormControl>
                </Flex>
                <Button
                  type='submit'
                  isLoading={!isDisconnected}
                  colorScheme='teal'
                  variant='solid'
                  size='md'
                  width='full'
                >
                  Join
                </Button>
              </Flex>
            </CardBody>
            <CardFooter paddingTop='2px'>
              <Container>
                <Center>
                  <Text fontSize='xs'>
                    Looking to create a new game?{' '}
                    <Link color='teal' href='/'>
                      Click here
                    </Link>
                  </Text>
                </Center>
              </Container>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default JoinForm;
