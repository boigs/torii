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

interface HostLobbyValues {
  amountOfRounds: number;
}

interface HostLobbyProps {
  onSubmit: (values: HostLobbyValues) => void;
  className?: string;
}

interface FormValues {
  amountOfRounds: number;
}

const HostLobby = ({ onSubmit, className }: HostLobbyProps) => {
  const onFormSubmit = (values: FormValues) => {
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
                      onChange={(val) => {
                        const handler = async () =>
                          await form.setFieldValue(field.name, Number(val));
                        handler().catch((error) => console.error(error));
                      }}
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
