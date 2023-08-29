"use client";

import React, { useState } from "react";
import { Button, Center, Container, Input } from "@chakra-ui/react";
import { addPlayer } from "src/app/api/route";

const Home: React.FC = () => {
  const [name, setName] = useState("");

  const add = async () => {
    const result = await addPlayer(name);
    console.log(result);
  };

  return (
    <Center>
      <Container centerContent>
        <p>Player name:</p>
        <br></br>
        <Input
          placeholder="xXx Hunter420 xXx"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Button onClick={add}>Add player</Button>
      </Container>
    </Center>
  );
};

export default Home;
