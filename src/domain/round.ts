import VotingItem from './votingItem';
import Word from './word';

class Round {
  private readonly _word: string;
  private readonly _playerWords: Map<string, Word[]>;
  private readonly _playerVotingWords: Map<string, string | null>;
  private readonly _votingItem: VotingItem | null;

  constructor(
    word: string,
    playerWords: Map<string, Word[]>,
    playerVotingWords: Map<string, string | null>,
    votingItem: VotingItem | null
  ) {
    this._word = word;
    this._playerWords = playerWords;
    this._playerVotingWords = playerVotingWords;
    this._votingItem = votingItem;
  }

  get word(): string {
    return this._word;
  }

  playerWords(nickname: string): Word[] {
    const words = this._playerWords.get(nickname);
    if (words === undefined) {
      throw `Could not find the words of player '${nickname}'`;
    }
    return words;
  }

  playerSentWords(nickname: string): boolean {
    return this._playerWords.has(nickname);
  }

  playerVotingWord(nickname: string): string | null {
    const word = this._playerVotingWords.get(nickname);
    if (word === undefined) {
      return null;
    }
    return word;
  }

  playerVoted(nickname: string): boolean {
    return this._playerVotingWords.has(nickname);
  }

  votingItem(): VotingItem {
    if (this._votingItem === null) {
      throw 'The Voting item is empty';
    }
    return this._votingItem;
  }
}

export default Round;
