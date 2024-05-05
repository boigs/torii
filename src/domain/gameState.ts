import HeadcrabState from './headcrabState';
import Player from './player';
import Round from './round';

class GameState {
  readonly player: Player;
  readonly nicknameToPlayer: Map<string, Player>;
  readonly rounds: Round[];
  readonly state: HeadcrabState;
  readonly amountOfRounds: number | null;

  constructor({
    player,
    nicknameToPlayer,
    rounds,
    state,
    amountOfRounds,
  }: {
    player: Player;
    nicknameToPlayer: Map<string, Player>;
    rounds: Round[];
    state: HeadcrabState;
    amountOfRounds: number | null;
  }) {
    this.player = player;
    this.nicknameToPlayer = nicknameToPlayer;
    this.rounds = rounds;
    this.state = state;
    this.amountOfRounds = amountOfRounds;
  }

  get players(): Player[] {
    return Array.from(this.nicknameToPlayer.values());
  }

  lastRound(): Round {
    return this.rounds.at(-1)!;
  }

  isLastRound(): boolean {
    return this.rounds.length === this.amountOfRounds;
  }
}

export default GameState;
