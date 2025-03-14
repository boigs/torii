import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Link as ChakraLink,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { Field, Form, Formik, FormikProps } from 'formik';
import { Link as ReactRouterLink } from 'react-router-dom';

import { validateNonEmpty } from 'src/helpers/formValidators';

interface JoinGameFormProps {
  gameId?: string;
  loading?: boolean;
  onSubmit?: (value: FormValues) => void;
}

interface FormValues {
  gameId: string;
  nickname: string;
}

const JoinGameForm = ({ gameId, loading, onSubmit }: JoinGameFormProps) => {
  const onFormSubmit = (values: FormValues) => {
    const { nickname, gameId } = values;
    onSubmit?.({ nickname, gameId });
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
        onSubmit={onFormSubmit}
      >
        {(props: FormikProps<FormValues>) => (
          <Form>
            <CardBody>
              <Flex flexDirection='column' gap='12px'>
                <Flex flexDirection='column' gap='8px'>
                  <FormControl
                    isInvalid={!!props.errors.gameId && props.submitCount > 0}
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
                      data-1p-ignore
                    />
                    <FormErrorMessage>{props.errors.gameId}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!props.errors.nickname && props.submitCount > 0}
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
                  isLoading={loading}
                  colorScheme='blue'
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
                    <ChakraLink as={ReactRouterLink} color='blue' to='/'>
                      Click here
                    </ChakraLink>
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

export default JoinGameForm;
