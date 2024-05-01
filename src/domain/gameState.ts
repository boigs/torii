import HeadcrabState from './headcrabState';
import Player from './player';
import Round from './round';

class GameState {
  readonly players: Player[];
  readonly rounds: Round[];
  readonly state: HeadcrabState;
  readonly amountOfRounds: number | null;

  constructor({
    players,
    rounds,
    state,
    amountOfRounds,
  }: {
    players: Player[];
    rounds: Round[];
    state: HeadcrabState;
    amountOfRounds: number | null;
  }) {
    this.players = players;
    this.rounds = rounds;
    this.state = state;
    this.amountOfRounds = amountOfRounds;
  }

  lastRound(): Round {
    return this.rounds.at(-1)!;
  }

  isLastRound(): boolean {
    return this.rounds.length === this.amountOfRounds;
  }
}

export default GameState;
