import { useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useGameContext } from 'src/components/context/GameContextProvider';
import CreateGameForm from 'src/components/createGame/CreateGameForm';

const Home = () => {
  const navigate = useNavigate();
  const { gameConnectionActor } = useGameContext();
  const [gameConnection] = [gameConnectionActor.getSnapshot()];

  useEffect(() => {
    if (gameConnection.context.gameJoined) {
      gameConnectionActor.send({ type: 'RESET' });
    } else if (gameConnection.matches('game')) {
      navigate('/game');
    }
  }, [gameConnection, navigate, gameConnectionActor]);

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
