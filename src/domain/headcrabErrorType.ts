export enum HeadCrabErrorType {
  Internal,
  WebsocketClosed,
  UnprocessableMessage,
  CommandNotAllowed,
  NotEnoughPlayers,
  GameDoesNotExist,
  PlayerAlreadyExists,
  RepeatedWords,
  GameAlreadyInProgress,
}

export default HeadCrabErrorType;
