import { ReactNode } from 'react';

import {
  CardBody,
  CardHeader,
  Card as ChakraCard,
  Divider,
  Heading,
} from '@chakra-ui/react';

import styles from './Card.module.scss';

type CardProps = {
  header?: ReactNode;
  className?: string;
  children?: ReactNode;
};

const Card: React.FC<CardProps> = ({ header, className, children }) => {
  return (
    <ChakraCard size='sm' className={className}>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          {header}
        </Heading>
        <Divider marginTop='12px' />
      </CardHeader>
      <CardBody className={styles.body}>{children}</CardBody>
    </ChakraCard>
  );
};

export default Card;
