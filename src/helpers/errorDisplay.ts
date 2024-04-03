import { HeadCrabErrorType, HeadcrabError } from 'src/websocket/in';

export const headcrabErrorToString = (error: HeadcrabError): string => {
  switch (error.type) {
    case HeadCrabErrorType.GameDoesNotExist:
      return 'The game you are trying to join does not seem to exist.';
    case HeadCrabErrorType.PlayerAlreadyExists:
      return 'There is another player with that nickname already.';
    case HeadCrabErrorType.NotEnoughPlayers:
      return 'Not enough players to start the game, at least 3 are needed.';
    case HeadCrabErrorType.UnprocessableMessage:
      return 'This action cannot be processed at this moment.';
    case HeadCrabErrorType.Internal:
    default:
      return 'Unknown error. Please contact support.';
  }
};
