class Word {
  private readonly _value: string;
  private readonly _isUsed: boolean;
  private readonly _score: number;

  constructor(value: string, isUsed: boolean, score: number) {
    this._value = value;
    this._isUsed = isUsed;
    this._score = score;
  }

  get value(): string {
    return this._value;
  }

  get isUsed(): boolean {
    return this._isUsed;
  }

  get score(): number {
    return this._score;
  }
}

export default Word;
