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
import { Field, Form, Formik, FormikProps } from 'formik';

import { validateNonEmpty } from 'src/helpers/formValidators';

interface FormValues {
  nickname: string;
}

interface HostFormProps {
  loading: boolean;
  onSubmit: (value: FormValues) => void;
}

const CreateGameForm = ({ loading, onSubmit }: HostFormProps) => {
  const onFormSubmit = (values: FormValues) => {
    onSubmit({ nickname: values.nickname });
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
        onSubmit={onFormSubmit}
      >
        {(props: FormikProps<FormValues>) => (
          <Form>
            <CardBody>
              <Flex flexDirection='column' gap='12px'>
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
                <Button
                  type='submit'
                  isLoading={loading}
                  colorScheme='blue'
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
                    <Link color='blue' href='/join'>
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

export default CreateGameForm;
