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
import React from 'react';
import { validateNonEmpty } from 'src/helpers/formValidators';

type FormValues = {
  nickname: string;
};

const HostForm: React.FC = () => {
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 500));
    alert(JSON.stringify(values, null, 2));
    router.push('/lobby');
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
                <Field
                  name='nickname'
                  validate={(value: string) =>
                    validateNonEmpty(value, 'Nickname')
                  }
                >
                  {({ field, form }: any) => (
                    <FormControl
                      isInvalid={form.errors.nickname && form.touched.nickname}
                    >
                      <Input {...field} placeholder='Nickname' autoComplete='off' />
                      <FormErrorMessage>
                        {form.errors.nickname}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
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

