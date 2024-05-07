import { HeadcrabError, HeadcrabErrorType } from 'src/domain';

export const headcrabErrorToString = (error: HeadcrabError): string => {
  switch (error.type) {
    // Domain
    case HeadcrabErrorType.GameAlreadyInProgress:
      return 'You cannot join because the game is already in progress.';
    case HeadcrabErrorType.GameDoesNotExist:
      return 'The game you are trying to join does not seem to exist.';
    case HeadcrabErrorType.InvalidStateForWordsSubmission:
      return 'You cannot perform that action.';
    case HeadcrabErrorType.InvalidStateForVotingWordSubmission:
      return 'You cannot perform that action.';
    case HeadcrabErrorType.NotEnoughPlayers:
      return 'Not enough players to start the game, at least 3 are needed.';
    case HeadcrabErrorType.NotEnoughRounds:
      return 'Not enough rounds to starth the game, at least 1 round is needed.';
    case HeadcrabErrorType.NonHostPlayerCannotContinueToNextRound:
      return 'You cannot perform that action.';
    case HeadcrabErrorType.NonHostPlayerCannotContinueToNextVotingItem:
      return 'You cannot perform that action.';
    case HeadcrabErrorType.NonHostPlayerCannotStartGame:
      return 'You cannot perform that action.';
    case HeadcrabErrorType.PlayerAlreadyExists:
      return 'There is another player with that nickname already.';
    case HeadcrabErrorType.PlayerCannotSubmitNonExistingOrUsedVotingWord:
      return 'You cannot perform that action.';
    case HeadcrabErrorType.PlayerCannotSubmitVotingWordWhenVotingItemIsNone:
      return 'You cannot perform that action.';
    case HeadcrabErrorType.RepeatedWords:
      return `You cannot submit the same word more than once. Repeated words: ${error.detail}`;
    case HeadcrabErrorType.VotingItemPlayerCannotSubmitVotingWord:
      return 'You cannot perform that action.';
    // External
    case HeadcrabErrorType.UnprocessableWebsocketMessage:
      return 'This action cannot be processed at this moment.';
    case HeadcrabErrorType.WebsocketClosed:
      return 'Unknown error. Please contact support.';
    // Internal
    case HeadcrabErrorType.Internal:
      return 'Unknown error. Please contact support.';
  }
};

export const shouldEndGameAfterError = (error: HeadcrabErrorType): boolean => {
  switch (error) {
    case HeadcrabErrorType.GameAlreadyInProgress:
      return true;
    case HeadcrabErrorType.GameDoesNotExist:
      return true;
    case HeadcrabErrorType.PlayerAlreadyExists:
      return true;
    case HeadcrabErrorType.Internal:
      return true;
    default:
      return false;
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
