import React from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { Field, Form, Formik, FormikProps } from 'formik';

import styles from './HostLobby.module.scss';

type HostLobbyValues = {
  amountOfRounds: number;
};

type HostLobbyProps = {
  onSubmit: (values: HostLobbyValues) => void;
  className?: string;
};

type FormValues = {
  amountOfRounds: number;
};

const HostLobby: React.FC<HostLobbyProps> = ({ onSubmit, className }) => {
  const onFormSubmit = async (values: FormValues) => {
    onSubmit({ amountOfRounds: values.amountOfRounds });
  };

  return (
    <Card size='sm' className={className}>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Configuration
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
              <Button
                colorScheme='blue'
                variant='solid'
                size='md'
                type='submit'
                width='full'
              >
                Start
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export type { HostLobbyValues };
export default HostLobby;
