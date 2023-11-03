import React from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { Field, Form, Formik, FormikFormProps, FormikProps } from 'formik';

import styles from './AdminLobby.module.scss';

type AdminLobbyValues = {
  amountOfRounds: number;
};

type AdminLobbyProps = {
  onSubmit: (values: AdminLobbyValues) => void;
};

type FormValues = {
  amountOfRounds: number;
};

const AdminLobby: React.FC<AdminLobbyProps> = ({ onSubmit }) => {
  const onFormSubmit = async (values: FormValues) => {
    onSubmit({ amountOfRounds: values.amountOfRounds });
  };

  return (
    <Card size='sm' width='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Game configuration
        </Heading>
        <Divider marginTop={'12px'} />
      </CardHeader>
      <Formik
        initialValues={{
          amountOfRounds: 3,
        }}
        onSubmit={onFormSubmit}
      >
        {() => (
          <Form>
            <CardBody className={styles.adminLobbyForm}>
              <Field name='amountOfRounds'>
                {({
                  field,
                  form,
                }: {
                  field: { name: string };
                  form: FormikProps<FormValues>;
                }) => (
                  <FormControl className={styles.amountOfRoundsFormItem}>
                    <FormLabel className={styles.amountOfRoundsLabel}>
                      Amount of rounds:
                    </FormLabel>
                    <NumberInput
                      className={styles.amountOfRoundsInput}
                      defaultValue={3}
                      min={3}
                      max={5}
                      keepWithinRange={true}
                      clampValueOnBlur={true}
                      onChange={(val) =>
                        form.setFieldValue(field.name, Number(val))
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
              </Field>
            </CardBody>
            <CardFooter>
              <Flex className={styles.createButtonContainer}>
                <Button
                  colorScheme='teal'
                  variant='solid'
                  size='md'
                  type='submit'
                >
                  Start
                </Button>
              </Flex>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export type { AdminLobbyValues };
export default AdminLobby;
