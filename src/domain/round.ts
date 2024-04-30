import VotingItem from './votingItem';
import Word from './word';

class Round {
  readonly word: string;
  readonly playerWords: Map<string, Word[]>;
  readonly playerVotingWords: Map<string, string | null>;
  readonly votingItem: VotingItem | null;

  constructor({
    word,
    playerWords,
    playerVotingWords,
    votingItem,
  }: {
    word: string;
    playerWords: Map<string, Word[]>;
    playerVotingWords: Map<string, string | null>;
    votingItem: VotingItem | null;
  }) {
    this.word = word;
    this.playerWords = playerWords;
    this.playerVotingWords = playerVotingWords;
    this.votingItem = votingItem;
  }

  getPlayerWords(nickname: string): Word[] {
    const words = this.playerWords.get(nickname);
    if (words === undefined) {
      throw `Could not find the words of player '${nickname}'`;
    }
    return words;
  }

  hasPlayerSentWords(nickname: string): boolean {
    return this.playerWords.has(nickname);
  }

  getPlayerVotingWord(nickname: string): string | null {
    return this.playerVotingWords.get(nickname) ?? null;
  }

  hasPlayerVoted(nickname: string): boolean {
    return this.playerVotingWords.has(nickname);
  }

  getVotingItem(): VotingItem {
    if (this.votingItem === null) {
      throw 'The Voting item is empty';
    }
    return this.votingItem;
  }
}

export default Round;
