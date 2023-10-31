import Player from 'src/domain/player';

export enum WsType {
  Error = 'error',
  GameState = 'gameState',
}

export type MessageType = {
  type: WsType;
};

export type HeadcrabError = {
  message: string;
};

export type GameState = {
  players: Player[];
};

export type WsMessage = MessageType & (GameState | HeadcrabError);
