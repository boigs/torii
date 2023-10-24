export type GameContextType = {
  gameId?: string;
  nickname?: string;
  setNickname: (nickname: string) => void;
  setGameId: (gameId: string) => void;
  players: Player[];
  connected: boolean;
};

export enum Type {
  Error = 'error',
  GameState = 'gameState',
}

export type MessageType = {
  type: Type;
};

export type HeadcrabError = {
  message: string;
};

export type Player = {
  nickname: string;
  isHost: boolean;
};

export type GameState = {
  players: Player[];
};

export type Message = MessageType & (GameState | HeadcrabError);
