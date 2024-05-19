import { useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGameContext } from 'src/components/context/GameContextProvider';
import JoinGameForm from 'src/components/joinGame/JoinForm';

const Join = () => {
  // const router = useRouter();
  const { gameId } = useParams();
  const { gameConnectionActor } = useGameContext();
  const [gameConnection] = [gameConnectionActor.getSnapshot()];

  useEffect(() => {
    if (gameConnection.context.gameJoined) {
      gameConnectionActor.send({ type: 'RESET' });
    } else if (gameConnection.matches('game')) {
      // router.push('/game');
    }
  }, [gameConnection, /*router,*/ gameConnectionActor]);

  return (
    <Center>
      <JoinGameForm
        gameId={gameId}
        loading={!gameConnection.matches('disconnected')}
        onSubmit={({ gameId, nickname }) => {
          gameConnectionActor.send({ type: 'JOIN_GAME', gameId, nickname });
        }}
      />
    </Center>
  );
};

export default Join;
