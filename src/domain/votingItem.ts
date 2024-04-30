class VotingItem {
  private readonly _nickname: string;
  private readonly _word: string;

  constructor(nickname: string, word: string) {
    this._nickname = nickname;
    this._word = word;
  }

  get nickname(): string {
    return this._nickname;
  }

  get word(): string {
    return this._word;
  }
}

export default VotingItem;
