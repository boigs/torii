class Player {
  private readonly _nickname: string;
  private readonly _isHost: boolean;
  private readonly _isConnected: boolean;

  constructor(nickname: string, isHost: boolean, isConnected: boolean) {
    this._nickname = nickname;
    this._isHost = isHost;
    this._isConnected = isConnected;
  }

  get nickname(): string {
    return this._nickname;
  }

  get isHost(): boolean {
    return this._isHost;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }
}

export default Player;
