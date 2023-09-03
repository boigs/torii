import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { validateNonEmpty } from 'src/helpers/formValidators';

const JoinForm: React.FC = () => {
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
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
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
                        <Input {...field} placeholder='Game Id' />
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
                        <Input {...field} placeholder='Nickname' />
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
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default JoinForm;

