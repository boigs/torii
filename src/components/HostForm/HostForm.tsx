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

import { validateNonEmpty } from 'src/helpers/formValidators';
import { GameFiniteStateMachineContext } from 'src/state/GameContext/gameState';

type FormValues = {
  nickname: string;
};

const HostForm: React.FC = () => {
  const router = useRouter();
  const { service } = useContext(GameFiniteStateMachineContext);
  var isDisconnected = useSelector(service, (state) =>
    state.matches('disconnected')
  );
  var isLobby = useSelector(service, (state) => state.matches('lobby'));

  useEffect(() => {
    if (isLobby) {
      router.push('/game');
    }
  }, [isLobby]);

  const onSubmit = async (values: FormValues) =>
    service.send({ type: 'CREATE_GAME', value: { nickname: values.nickname } });

  return (
    <Card size='sm' width='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          New Game
        </Heading>
      </CardHeader>
      <Formik
        initialValues={{
          nickname: '',
        }}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form>
            <CardBody>
              <Flex flexDirection='column' gap='12px'>
                <FormControl
                  isInvalid={!!props.errors.nickname && props.touched.nickname}
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
                <Button
                  type='submit'
                  isLoading={!isDisconnected}
                  colorScheme='teal'
                  variant='solid'
                  size='md'
                  width='full'
                >
                  Create
                </Button>
              </Flex>
            </CardBody>
            <CardFooter paddingTop='2px'>
              <Container>
                <Center>
                  <Text fontSize='xs'>
                    Looking to join an existing game?{' '}
                    <Link color='teal' href='/join'>
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

export default HostForm;
