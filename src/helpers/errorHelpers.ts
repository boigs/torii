import GameError from 'src/domain/gameError';
import GameErrorType from 'src/domain/gameErrorType';

export const gameErrorToString = (error: GameError): string => {
  switch (error.type) {
    // Domain
    case GameErrorType.GameAlreadyInProgress:
      return 'You cannot join because the game is already in progress.';
    case GameErrorType.GameDoesNotExist:
      return 'The game you are trying to join does not seem to exist.';
    case GameErrorType.InvalidStateForWordsSubmission:
      return 'You cannot perform that action.';
    case GameErrorType.InvalidStateForVotingWordSubmission:
      return 'You cannot perform that action.';
    case GameErrorType.NotEnoughPlayers:
      return 'Not enough players to start the game, at least 3 are needed.';
    case GameErrorType.NotEnoughRounds:
      return 'Not enough rounds to starth the game, at least 1 round is needed.';
    case GameErrorType.NonHostPlayerCannotContinueToNextRound:
      return 'You cannot perform that action.';
    case GameErrorType.NonHostPlayerCannotContinueToNextVotingItem:
      return 'You cannot perform that action.';
    case GameErrorType.NonHostPlayerCannotStartGame:
      return 'You cannot perform that action.';
    case GameErrorType.PlayerAlreadyExists:
      return 'There is another player with that nickname already.';
    case GameErrorType.PlayerCannotSubmitNonExistingOrUsedVotingWord:
      return 'You cannot perform that action.';
    case GameErrorType.PlayerCannotSubmitVotingWordWhenVotingItemIsNone:
      return 'You cannot perform that action.';
    case GameErrorType.RepeatedWords:
      return `You cannot submit the same word more than once. Repeated words: ${error.detail}`;
    case GameErrorType.VotingItemPlayerCannotSubmitVotingWord:
      return 'You cannot perform that action.';
    case GameErrorType.NonHostPlayerCannotSendPlayAgain:
      return 'You cannot start a new game.';
    // External
    case GameErrorType.UnprocessableWebsocketMessage:
      return 'This action cannot be processed at this moment.';
    case GameErrorType.WebsocketClosed:
      return 'Unknown error. Please contact support.';
    // Internal
    case GameErrorType.Internal:
      return 'Unknown error. Please contact support.';
  }
};

export const shouldEndGameAfterError = (error: GameErrorType): boolean => {
  switch (error) {
    case GameErrorType.GameAlreadyInProgress:
      return true;
    case GameErrorType.GameDoesNotExist:
      return true;
    case GameErrorType.PlayerAlreadyExists:
      return true;
    case GameErrorType.Internal:
      return true;
    default:
      return false;
  }
};

export const shouldShowErrorToast = (error: GameErrorType): boolean => {
  switch (error) {
    case GameErrorType.WebsocketClosed:
      return false;
    default:
      return true;
  }
};
