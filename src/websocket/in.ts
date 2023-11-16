import Player from 'src/domain/player';

export enum WsTypeIn {
  Error = 'error',
  GameState = 'gameState',
  ChatText = 'chatMessage',
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

export type ChatMessage = {
  sender: string;
  content: string;
};

export type WsMessageIn = MessageTypeIn &
  (GameState | HeadcrabError | ChatMessage);
