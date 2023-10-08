import React from 'react';

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
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';

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

  const onSubmit = async (values: FormValues) => {
    localStorage.setItem('nickname', values.nickname);
    router.push(`/game/${values.gameId}`);
  };

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
                    isInvalid={
                      props.errors.gameId !== null && props.touched.gameId
                    }
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
                      props.errors.nickname !== null && props.touched.nickname
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
                  isLoading={props.isSubmitting}
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
