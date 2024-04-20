import RoundScore from './roundScore';
import Word from './word';

type Round = {
  word: string;
  playerWords: { [nickname: string]: Word[] };
  score: RoundScore;
};

export default Round;
