import GameState from './gameState';
import Player from './player';
import Round from './round';

class Game {
  readonly id: string;
  readonly player: Player;
  readonly nicknameToPlayer: Map<string, Player>;
  readonly rounds: Round[];
  readonly state: GameState;
  readonly amountOfRounds: number | null;

  constructor({
    id,
    player,
    nicknameToPlayer,
    rounds,
    state,
    amountOfRounds,
  }: {
    id: string;
    player: Player;
    nicknameToPlayer: Map<string, Player>;
    rounds: Round[];
    state: GameState;
    amountOfRounds: number | null;
  }) {
    this.id = id;
    this.player = player;
    this.nicknameToPlayer = nicknameToPlayer;
    this.rounds = rounds;
    this.state = state;
    this.amountOfRounds = amountOfRounds;
  }

  static default: Game = new Game({
    id: '',
    player: { nickname: '', isHost: false, isConnected: false },
    nicknameToPlayer: new Map(),
    rounds: [],
    state: GameState.Undefined,
    amountOfRounds: null,
  });

  get players(): Player[] {
    return [...this.nicknameToPlayer.values()];
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

export default Game;
