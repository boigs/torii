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

type FormValues = {
  gameId: string;
  nickname: string;
};

const JoinForm: React.FC = () => {
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 500));
    router.push('/lobby');
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
          gameId: '',
          nickname: '',
        }}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form>
            <CardBody>
              <Flex flexDirection='column' gap='12px'>
                <Flex flexDirection='column' gap='8px'>
                  <Field
                    name='gameId'
                    validate={(value: string) =>
                      validateNonEmpty(value, 'Game Id')
                    }
                  >
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.gameId && form.touched.gameId}
                      >
                        <Input
                          {...field}
                          placeholder='Game Id'
                          autoComplete='off'
                        />
                        <FormErrorMessage>
                          {form.errors.gameId}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name='nickname'
                    validate={(value: string) =>
                      validateNonEmpty(value, 'Nickname')
                    }
                  >
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.nickname && form.touched.nickname
                        }
                      >
                        <Input
                          {...field}
                          placeholder='Nickname'
                          autoComplete='off'
                        />
                        <FormErrorMessage>
                          {form.errors.nickname}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
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
