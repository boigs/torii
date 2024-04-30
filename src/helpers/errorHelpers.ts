import HeadcrabError from 'src/domain/headcrabError';
import HeadCrabErrorType from 'src/domain/headcrabErrorType';

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
    case HeadCrabErrorType.RepeatedWords:
      return 'You cannot submit the same word more than once.';
    case HeadCrabErrorType.CommandNotAllowed:
      return 'You cannot perform that action.';
    case HeadCrabErrorType.GameAlreadyInProgress:
      return 'You cannot join because the game is already in progress.';
    case HeadCrabErrorType.Internal:
    case HeadCrabErrorType.WebsocketClosed:
      return 'Unknown error. Please contact support.';
  }
};

export const shouldEndGameAfterError = (error: HeadCrabErrorType): boolean => {
  switch (error) {
    case HeadCrabErrorType.GameDoesNotExist:
      return true;
    case HeadCrabErrorType.PlayerAlreadyExists:
      return true;
    case HeadCrabErrorType.NotEnoughPlayers:
      return false;
    case HeadCrabErrorType.Internal:
      return true;
    case HeadCrabErrorType.UnprocessableMessage:
      return false;
    case HeadCrabErrorType.WebsocketClosed:
      return false; // because we want to attempt reconnecting
    case HeadCrabErrorType.CommandNotAllowed:
      return false;
    case HeadCrabErrorType.RepeatedWords:
      return false;
    case HeadCrabErrorType.GameAlreadyInProgress:
      return true;
  }
};

export const shouldShowErrorToast = (error: HeadCrabErrorType): boolean => {
  switch (error) {
    case HeadCrabErrorType.WebsocketClosed:
      return false;
    default:
      return true;
  }
};
