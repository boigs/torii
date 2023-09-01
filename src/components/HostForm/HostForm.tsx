import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  Heading,
  Input,
} from '@chakra-ui/react';
import React from 'react';

const HostForm: React.FC = () => {
  return (
    <Card size='sm' width='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          New Game
        </Heading>
      </CardHeader>
      <form>
        <CardBody>
          <Flex flexDirection='column' gap='12px'>
            <FormControl isRequired>
              <Input placeholder='Nickname' />
            </FormControl>
            <Button
              type='submit'
              colorScheme='teal'
              variant='solid'
              size='md'
              width='100%'
            >
              Create
            </Button>
          </Flex>
        </CardBody>
      </form>
    </Card>
  );
};

export default HostForm;

