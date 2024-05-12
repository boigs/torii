import GameErrorType from './gameErrorType';

interface GameError {
  readonly type: GameErrorType;
  readonly title: string;
  readonly detail: string;
}

export default GameError;
