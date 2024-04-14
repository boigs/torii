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
  title?: string;
  className?: string;
  children?: ReactNode;
};

const Card: React.FC<CardProps> = ({ title, className, children }) => {
  return (
    <ChakraCard size='sm' className={className}>
      <CardHeader>
        <Heading as='h3' textAlign='center' size='md'>
          {title}
        </Heading>
        <Divider marginTop='12px' />
      </CardHeader>
      <CardBody className={styles.body}>{children}</CardBody>
    </ChakraCard>
  );
};

export default Card;
