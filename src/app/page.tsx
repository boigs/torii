"use client";

import React, { useState, useMemo } from "react";
import { Button, Center, Container } from "@chakra-ui/react";

const MAX_RANDOM: number = 5;

const random: (min: number, max: number) => number = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const Home: React.FC = () => {
  const [count, setCount] = useState(0);
  const minCountValueToShowMessage = useMemo(
    () => random(1, MAX_RANDOM + 1),
    [],
  );

  return (
    <Center>
      <Container centerContent>
        <p>Hello world</p>
        <p>Counter: {count}</p>
        <Button colorScheme="blue" onClick={() => setCount(count + 1)}>
          Count
        </Button>
        {count >= minCountValueToShowMessage ? (
          <p>El contador cuenta, sí señor</p>
        ) : null}
      </Container>
    </Center>
  );
};

export default Home;
