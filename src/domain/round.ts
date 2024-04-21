import RoundScore from './roundScore';
import Word from './word';

interface Round {
  word: string;
  playerWords: Record<string, Word[]>;
  score: RoundScore;
}

export default Round;
