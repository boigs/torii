import Player from './player';
import VotingItem from './votingItem';
import Word from './word';

class Round {
  readonly word: string;
  private readonly playerWords: Map<Player, Word[]>;
  private readonly playerVotingWords: Map<Player, string | null>;
  private readonly votingItem: VotingItem | null;

  constructor({
    word,
    playerWords,
    playerVotingWords,
    votingItem,
  }: {
    word: string;
    playerWords: Map<Player, Word[]>;
    playerVotingWords: Map<Player, string | null>;
    votingItem: VotingItem | null;
  }) {
    this.word = word;
    this.playerWords = playerWords;
    this.playerVotingWords = playerVotingWords;
    this.votingItem = votingItem;
  }

  getPlayerWords(player: Player): Word[] {
    const words = this.playerWords.get(player);
    if (words === undefined) {
      throw new Error(
        `Could not find the words of player '${player.nickname}'`
      );
    }
    return words;
  }

  hasPlayerSentWords(player: Player): boolean {
    return this.playerWords.has(player);
  }

  getPlayerVotingWord(player: Player): string | null {
    return this.playerVotingWords.get(player) ?? null;
  }

  hasPlayerVoted(player: Player): boolean {
    return this.playerVotingWords.has(player);
  }

  haveAllPlayersVoted(players: Player[]): boolean {
    return players.every((player) => this.hasPlayerVoted(player));
  }

  getVotingItem(): VotingItem {
    if (this.votingItem === null) {
      throw new Error('No voting item found');
    }
    return this.votingItem;
  }
}

export default Round;
