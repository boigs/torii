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
  Text,
} from '@chakra-ui/react';

import styles from './AdminLobby.module.scss';

type AdminLobbyValues = {
  amountOfRounds: number;
};

type AdminLobbyProps = {
  onSubmit: (values: AdminLobbyValues) => void;
};

const AdminLobby: React.FC<AdminLobbyProps> = ({ onSubmit }) => {
  return (
    <Card size='sm' width='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Admin options
        </Heading>
        <Divider marginTop={'12px'} />
      </CardHeader>
      <CardBody className={styles.body}>
        <FormControl>
          <FormLabel className={styles.maxPlayersLabel}>
            Amount of rounds:
          </FormLabel>
          <NumberInput
            defaultValue={3}
            min={3}
            max={5}
            keepWithinRange={true}
            clampValueOnBlur={true}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </CardBody>
      <CardFooter>
        <Flex className={styles.createButtonContainer}>
          <Button
            colorScheme='teal'
            variant='solid'
            size='md'
            onClick={() => onSubmit({ amountOfRounds: 3 })}
          >
            Start
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export type { AdminLobbyValues };
export default AdminLobby;
