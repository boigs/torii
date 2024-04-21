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
  NotEnoughPlayers = 'NOT_ENOUGH_PLAYERS',
  Internal = 'INTERNAL_SERVER',
  UnprocessableMessage = 'UNPROCESSABLE_WEBSOCKET_MESSAGE',
  WebsocketClosed = 'WEBSOCKET_CLOSED',
  RepeatedWords = 'REPEATED_WORDS',
  CommandNotAllowed = 'COMMAND_NOT_ALLOWED',
}

export interface MessageTypeIn {
  kind: WsTypeIn;
}

export interface HeadcrabError {
  type: HeadCrabErrorType;
  title: string;
  detail: string;
}

export enum HeadcrabState {
  LOBBY = 'Lobby',
  PLAYERS_WRITING_WORDS = 'PlayersWritingWords',
  PLAYERS_SENDING_WORD_SUBMISSION = 'PlayersSendingWordSubmission',
}

export interface GameState {
  players: Player[];
  rounds: Round[];
  state: HeadcrabState;
}

export interface ChatMessage {
  sender: string;
  content: string;
}

export type WsMessageIn = MessageTypeIn &
  (GameState | HeadcrabError | ChatMessage);
