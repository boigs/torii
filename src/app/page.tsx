"use client";

import React, { useState } from "react";
import { Text, Button, Center, Container, Input } from "@chakra-ui/react";
import PlayerDisplay from "src/components/PlayerDisplay";

const Home: React.FC = () => {
  
  return (
    <Center>
      <Container centerContent>
        <PlayerDisplay />
      </Container>
    </Center>
  );
};

export default Home;
