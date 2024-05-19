import { useEffect } from 'react';

import { Center } from '@chakra-ui/react';

import { useGameContext } from 'src/components/context/GameContextProvider';
import CreateGameForm from 'src/components/createGame/CreateGameForm';

const Home = () => {
  // const router = useRouter();
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
      <CreateGameForm
        loading={!gameConnection.matches('disconnected')}
        onSubmit={({ nickname }) => {
          gameConnectionActor.send({ type: 'CREATE_GAME', nickname });
        }}
      />
    </Center>
  );
};

export default Home;
