import { Button, Text, VStack } from '@chakra-ui/react';

import Card from 'src/components/Shared/Card';
import Spinner from 'src/components/Shared/Spinner';
import Player from 'src/domain/player';

import styles from './EndOfRound.module.scss';

interface EndOfRoundProps {
  player: Player;
  isLastRound: boolean;
  onContinueClicked: () => void;
  className?: string;
}

interface Labels {
  title: string;
  hostInstructions: string;
  nonHostInstructions: string;
  continueButtonText: string;
}

const roundOverLabels: Labels = {
  title: "Round's Over",
  hostInstructions: 'Press the button to start the next round.',
  nonHostInstructions: 'Please wait until the host starts the next round.',
  continueButtonText: 'Next round',
};

const gameOverLabels: Labels = {
  title: "Game's Over",
  hostInstructions: "Press the button to view the game's summary.",
  nonHostInstructions:
    "Please wait until the hosts advances to game's summary.",
  continueButtonText: 'Go to game summary',
};

const EndOfRound = ({
  player,
  isLastRound,
  onContinueClicked,
  className,
}: EndOfRoundProps) => {
  const labels = isLastRound ? gameOverLabels : roundOverLabels;

  return (
    <Card header={labels.title} className={className}>
      <VStack>
        <Text className={styles.instructions}>
          {player.isHost ? labels.hostInstructions : labels.nonHostInstructions}
        </Text>
        {player.isHost ? (
          <Button
            colorScheme='blue'
            onClick={onContinueClicked}
            className={styles.button}
          >
            {labels.continueButtonText}
          </Button>
        ) : (
          <Spinner />
        )}
      </VStack>
    </Card>
  );
};

export default EndOfRound;
