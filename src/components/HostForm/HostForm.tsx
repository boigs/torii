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
import React from 'react';
import { Formik, Field, Form } from 'formik';
import { validateNonEmpty } from 'src/helpers/formValidators';

const HostForm: React.FC = () => {
  return (
    <Card size='sm' width='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          New Game
        </Heading>
      </CardHeader>
      <Formik
        initialValues={{
          nickname: ''
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
                <Field name='nickname' validate={(value: string) => validateNonEmpty(value, 'Nickname')}>
                  {({ field, form }: any) => (
                    <FormControl isInvalid={form.errors.nickname && form.touched.nickname}>
                    <Input {...field} placeholder='Nickname' />
                    <FormErrorMessage>{form.errors.nickname}</FormErrorMessage>
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
          </Form>
        )}       
      </Formik>
    </Card>
  );
};

export default HostForm;

