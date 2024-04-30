import { Button, Text, VStack } from '@chakra-ui/react';

import Card from 'src/components/Card';
import Spinner from 'src/components/Spinner';
import Player from 'src/domain/player';

import styles from './EndOfRound.module.scss';

interface EndOfRoundProps {
  player: Player;
  onNextRoundClicked?: () => void;
  className?: string;
}

const EndOfRound = ({
  player,
  onNextRoundClicked,
  className,
}: EndOfRoundProps) => {
  return (
    <Card header="Round's Over" className={className}>
      <VStack>
        <Text className={styles.instructions}>
          {player.isHost
            ? 'Press the button to start the next round.'
            : 'Please wait until the host starts the next round.'}
        </Text>
        {player.isHost ? (
          <Button
            colorScheme='blue'
            onClick={onNextRoundClicked}
            className={styles.button}
          >
            Next round
          </Button>
        ) : (
          <Spinner />
        )}
      </VStack>
    </Card>
  );
};

export default EndOfRound;
