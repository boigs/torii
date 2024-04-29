import VotingItem from './votingItem';
import Word from './word';

interface Round {
  word: string;
  playerWords: Record<string, Word[]>;
  playerVotingWords: Record<string, string | null>;
  votingItem: VotingItem | null;
}

export default Round;
