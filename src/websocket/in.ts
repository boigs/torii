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
  GameAlreadyInProgress = 'GAME_ALREADY_IN_PROGRESS',
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
  PLAYERS_SUBMITTING_WORDS = 'PlayersSubmittingWords',
  PLAYERS_SUBMITTING_VOTING_WORD = 'PlayersSubmittingVotingWord',
  END_OF_ROUND = 'EndOfRound',
  END_OF_GAME = 'EndOfGame',
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
