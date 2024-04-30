export enum HeadcrabErrorType {
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

export default HeadcrabErrorType;
