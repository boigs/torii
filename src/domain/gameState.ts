import HeadcrabState from './headcrabState';
import Player from './player';
import Round from './round';

class GameState {
  private readonly _players: Player[];
  private readonly _rounds: Round[];
  private readonly _state: HeadcrabState;

  constructor(players: Player[], rounds: Round[], state: HeadcrabState) {
    this._players = players;
    this._rounds = rounds;
    this._state = state;
  }

  get players(): Player[] {
    return this._players;
  }

  get state(): HeadcrabState {
    return this._state;
  }

  lastRound(): Round {
    return this._rounds.at(-1)!;
  }
}

export default GameState;
