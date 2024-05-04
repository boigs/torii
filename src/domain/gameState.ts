import HeadcrabState from './headcrabState';
import Player from './player';
import Round from './round';

class GameState {
  readonly you: Player;
  readonly nicknameToPlayer: Map<string, Player>;
  readonly rounds: Round[];
  readonly state: HeadcrabState;
  readonly amountOfRounds: number | null;

  constructor({
    you,
    nicknameToPlayer,
    rounds,
    state,
    amountOfRounds,
  }: {
    you: Player;
    nicknameToPlayer: Map<string, Player>;
    rounds: Round[];
    state: HeadcrabState;
    amountOfRounds: number | null;
  }) {
    this.you = you;
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

  static getPlayer(
    nicknameToPlayer: Map<string, Player>,
    nickname: string
  ): Player {
    const player = nicknameToPlayer.get(nickname);
    if (player === undefined) {
      throw new Error(`Could not find the player '${nickname}'`);
    }
    return player;
  }
}

export default GameState;
