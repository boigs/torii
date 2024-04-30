import VotingItem from './votingItem';
import Word from './word';

interface Round {
  readonly word: string;
  readonly playerWords: Map<string, Word[]>;
  readonly playerVotingWords: Map<string, string | null>;
  readonly votingItem: VotingItem | null;
  getPlayerWords(nickname: string): Word[];
  hasPlayerSentWords(nickname: string): boolean;
  getPlayerVotingWord(nickname: string): string | null;
  hasPlayerVoted(nickname: string): boolean;
  getVotingItem(): VotingItem;
}

export const createRound = (
  word: string,
  playerWords: Map<string, Word[]>,
  playerVotingWords: Map<string, string | null>,
  votingItem: VotingItem | null
): Round => {
  return {
    word,
    playerWords,
    playerVotingWords,
    votingItem,
    getPlayerWords: (nickname) => {
      const words = playerWords.get(nickname);
      if (words === undefined) {
        throw `Could not find the words of player '${nickname}'`;
      }
      return words;
    },
    hasPlayerSentWords: (nickname) => playerWords.has(nickname),
    getPlayerVotingWord: (nickname) => {
      const word = playerVotingWords.get(nickname);
      if (word === undefined) {
        return null;
      }
      return word;
    },
    hasPlayerVoted: (nickname) => playerVotingWords.has(nickname),
    getVotingItem: () => {
      if (votingItem === null) {
        throw 'The Voting item is empty';
      }
      return votingItem;
    },
  };
};

export default Round;
