import Player from 'src/domain/player';
import Round from 'src/domain/round';

export enum WsTypeIn {
  Error = 'error',
  GameState = 'gameState',
  ChatText = 'chatMessage',
}

export enum HeadCrabErrorType {
  GameDoesNotExist = 'GAME_DOES_NOT_EXIST',
  PlayerAlreadyExists = 'PLAYER_ALREADY_EXISTS',
  Internal = 'INTERNAL_SERVER',
}

export type MessageTypeIn = {
  kind: WsTypeIn;
};

export type HeadcrabError = {
  type: HeadCrabErrorType;
  title: string;
  detail: string;
};

export enum HeadcrabState {
  LOBBY = 'Lobby',
  PLAYERS_WRITING_WORDS = 'PlayersWritingWords',
}

export type GameState = {
  players: Player[];
  rounds: Round[];
  state: HeadcrabState;
};

export type ChatMessage = {
  sender: string;
  content: string;
};

export type WsMessageIn = MessageTypeIn &
  (GameState | HeadcrabError | ChatMessage);
