import { Button, Center, Spinner, Text, VStack } from '@chakra-ui/react';

import AnimatedParent from 'src/components/AnimatedParent';
import Card from 'src/components/Card';
import Chat from 'src/components/Chat';
import JoinedPlayersList from 'src/components/JoinedPlayersList';
import { ChatMessage, GameState } from 'src/domain';
import { WsMessageOut, continueToNextRound } from 'src/websocket/out';

import styles from './EndOfRound.module.scss';

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

interface EndOfRoundProps {
  game: GameState;
  messages: ChatMessage[];
  sendWebsocketMessage: (message: WsMessageOut) => void;
}

const EndOfRound = ({
  game,
  messages,
  sendWebsocketMessage,
}: EndOfRoundProps) => {
  const labels = game.isLastRound() ? gameOverLabels : roundOverLabels;

  const sendContinueToNextRound = () => {
    sendWebsocketMessage(continueToNextRound());
  };

  return (
    <Center>
      <AnimatedParent className={styles.gameContainerGrid}>
        <VStack spacing='24px'>
          <Card header={labels.title} className={styles.width100}>
            <VStack>
              <Text className={styles.instructions}>
                {game.player.isHost
                  ? labels.hostInstructions
                  : labels.nonHostInstructions}
              </Text>
              {game.player.isHost ? (
                <Button
                  colorScheme='blue'
                  onClick={sendContinueToNextRound}
                  className={styles.button}
                >
                  {labels.continueButtonText}
                </Button>
              ) : (
                <Spinner />
              )}
            </VStack>
          </Card>
        </VStack>
        <JoinedPlayersList
          gameId={game.id}
          players={game.players}
          hideJoinUrl={true}
          className={styles.joinedPlayersList}
        />
        <Chat
          messages={messages}
          sendWebsocketMessage={sendWebsocketMessage}
          className={styles.chat}
        />
      </AnimatedParent>
    </Center>
  );
};

export default EndOfRound;
