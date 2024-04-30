import { HeadcrabError, HeadcrabErrorType } from 'src/domain';

export const headcrabErrorToString = (error: HeadcrabError): string => {
  switch (error.type) {
    case HeadcrabErrorType.GameDoesNotExist:
      return 'The game you are trying to join does not seem to exist.';
    case HeadcrabErrorType.PlayerAlreadyExists:
      return 'There is another player with that nickname already.';
    case HeadcrabErrorType.NotEnoughPlayers:
      return 'Not enough players to start the game, at least 3 are needed.';
    case HeadcrabErrorType.UnprocessableMessage:
      return 'This action cannot be processed at this moment.';
    case HeadcrabErrorType.RepeatedWords:
      return 'You cannot submit the same word more than once.';
    case HeadcrabErrorType.CommandNotAllowed:
      return 'You cannot perform that action.';
    case HeadcrabErrorType.GameAlreadyInProgress:
      return 'You cannot join because the game is already in progress.';
    case HeadcrabErrorType.Internal:
    case HeadcrabErrorType.WebsocketClosed:
      return 'Unknown error. Please contact support.';
  }
};

export const shouldEndGameAfterError = (error: HeadcrabErrorType): boolean => {
  switch (error) {
    case HeadcrabErrorType.GameDoesNotExist:
      return true;
    case HeadcrabErrorType.PlayerAlreadyExists:
      return true;
    case HeadcrabErrorType.NotEnoughPlayers:
      return false;
    case HeadcrabErrorType.Internal:
      return true;
    case HeadcrabErrorType.UnprocessableMessage:
      return false;
    case HeadcrabErrorType.WebsocketClosed:
      // Because we want to attempt reconnecting
      return false;
    case HeadcrabErrorType.CommandNotAllowed:
      return false;
    case HeadcrabErrorType.RepeatedWords:
      return false;
    case HeadcrabErrorType.GameAlreadyInProgress:
      return true;
  }
};

export const shouldShowErrorToast = (error: HeadcrabErrorType): boolean => {
  switch (error) {
    case HeadcrabErrorType.WebsocketClosed:
      return false;
    default:
      return true;
  }
};
