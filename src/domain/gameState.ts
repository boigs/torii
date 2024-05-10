import HeadcrabState from './headcrabState';
import Player from './player';
import Round from './round';

class GameState {
  readonly id: string;
  readonly state: HeadcrabState;
  readonly player: Player;
  readonly nicknameToPlayer: Map<string, Player>;
  readonly rounds: Round[];
  readonly amountOfRounds: number | null;

  constructor({
    id,
    state,
    player,
    nicknameToPlayer,
    rounds,
    amountOfRounds,
  }: {
    id: string;
    state: HeadcrabState;
    player: Player;
    nicknameToPlayer: Map<string, Player>;
    rounds: Round[];
    amountOfRounds: number | null;
  }) {
    this.id = id;
    this.state = state;
    this.player = player;
    this.nicknameToPlayer = nicknameToPlayer;
    this.rounds = rounds;
    this.amountOfRounds = amountOfRounds;
  }

  get players(): Player[] {
    return Array.from(this.nicknameToPlayer.values());
  }

  lastRound(): Round {
    const lastRound = this.rounds.at(-1);
    if (lastRound === undefined) {
      throw new Error(`Could not find the last round`);
    }
    return lastRound;
  }

  isLastRound(): boolean {
    return this.rounds.length === this.amountOfRounds;
  }
}

export default GameState;
