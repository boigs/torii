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

const JoinForm: React.FC = () => {
  return (
    <Card size='sm' width='sm'>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          Join Game
        </Heading>
      </CardHeader>
      <form>
        <CardBody>
          <Flex flexDirection='column' gap='12px'>
            <Flex flexDirection='column' gap='8px'>
              <FormControl isRequired>
                <Input placeholder='Game id' />
              </FormControl>
              <FormControl isRequired>
                <Input placeholder='Nickname' />
              </FormControl>
            </Flex>
            <Button
              type='submit'
              colorScheme='teal'
              variant='solid'
              size='md'
              width='100%'
            >
              Join
            </Button>
          </Flex>
        </CardBody>
      </form>
    </Card>
  );
};

export default JoinForm;

