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

import config from 'src/config';
import { validateNonEmpty } from 'src/helpers/formValidators';

type FormValues = {
  nickname: string;
};

const HostForm: React.FC = () => {
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    let gameId = await fetch(`${config.headcrabHttpBaseUrl}/game`, {
      method: 'POST',
    })
      .then((response: any) => response.json())
      .then((response: any) => response.id);

    localStorage.setItem('nickname', values.nickname);
    router.push(`/game/${gameId}`);
  };

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
                  isLoading={props.isSubmitting}
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
