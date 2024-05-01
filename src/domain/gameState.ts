import HeadcrabState from './headcrabState';
import Player from './player';
import Round from './round';

class GameState {
  readonly players: Player[];
  readonly rounds: Round[];
  readonly state: HeadcrabState;

  constructor({
    players,
    rounds,
    state,
  }: {
    players: Player[];
    rounds: Round[];
    state: HeadcrabState;
  }) {
    this.players = players;
    this.rounds = rounds;
    this.state = state;
  }

  lastRound(): Round {
    return this.rounds.at(-1)!;
  }
}

export default GameState;
