import HeadcrabState from './headcrabState';
import Player from './player';
import Round from './round';

interface GameState {
  readonly players: Player[];
  readonly rounds: Round[];
  readonly state: HeadcrabState;
  lastRound(): Round;
}

export const createGameState = (
  players: Player[],
  rounds: Round[],
  state: HeadcrabState
): GameState => {
  return {
    players,
    rounds,
    state,
    lastRound: () => rounds.at(-1)!,
  };
};

export default GameState;
