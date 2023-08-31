import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

import styles from './Player.module.scss';

type PlayerProps = {
  id: string;
  name: string;
};

const Player: React.FC<PlayerProps> = ({ name }) => {
  return (
    <Flex className={styles.porro}>
      <Avatar src="https://bit.ly/sage-adebayo" />
      <Box>
        <Text fontWeight="bold">{name}</Text>
      </Box>
    </Flex>
  );
};

export default Player;
export type { PlayerProps };
