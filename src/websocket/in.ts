import Player from 'src/domain/player';

export enum WsTypeIn {
  Error = 'error',
  GameState = 'gameState',
  ChatText = 'chatText',
}

export type MessageTypeIn = {
  type: WsTypeIn;
};

export type HeadcrabError = {
  message: string;
};

export type GameState = {
  players: Player[];
  state: string;
};

export type ChatText = {
  text: string;
};

export type WsMessageIn = MessageTypeIn &
  (GameState | HeadcrabError | ChatText);
