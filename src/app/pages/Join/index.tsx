import { useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGameContext } from 'src/components/context/GameContextProvider';
import JoinGameForm from 'src/components/joinGame/JoinForm';

const Join = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
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
