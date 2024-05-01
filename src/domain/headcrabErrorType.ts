export enum HeadcrabErrorType {
  Internal = 'Internal',
  WebsocketClosed = 'WebsocketClosed',
  UnprocessableMessage = 'UnprocessableMessage',
  CommandNotAllowed = 'CommandNotAllowed',
  NotEnoughPlayers = 'NotEnoughPlayers',
  GameDoesNotExist = 'GameDoesNotExist',
  PlayerAlreadyExists = 'PlayerAlreadyExists',
  RepeatedWords = 'RepeatedWords',
  GameAlreadyInProgress = 'GameAlreadyInProgress',
}

export default HeadcrabErrorType;
