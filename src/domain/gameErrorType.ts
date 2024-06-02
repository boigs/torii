export enum GameErrorType {
  // Domain
  CannotRejectMatchedWordsWhenVotingItemIsNone = 'CannotRejectMatchedWordsWhenVotingItemIsNone',
  CannotResubmitRejectedMatchedWord = 'CannotResubmitRejectedMatchedWord',
  GameAlreadyInProgress = 'GameAlreadyInProgress',
  GameDoesNotExist = 'GameDoesNotExist',
  InvalidStateForRejectingMatchedWords = 'InvalidStateForRejectingMatchedWords',
  InvalidStateForWordsSubmission = 'InvalidStateForWordsSubmission',
  InvalidStateForVotingWordSubmission = 'InvalidStateForVotingWordSubmission',
  NonHostCannotRejectMatchedWords = 'NonHostCannotRejectMatchedWords',
  NotEnoughPlayers = 'NotEnoughPlayers',
  NotEnoughRounds = 'NotEnoughRounds',
  NonHostPlayerCannotContinueToNextRound = 'NonHostPlayerCannotContinueToNextRound',
  NonHostPlayerCannotSendPlayAgain = 'NonHostPlayerCannotSendPlayAgain',
  NonHostPlayerCannotContinueToNextVotingItem = 'NonHostPlayerCannotContinueToNextVotingItem',
  NonHostPlayerCannotStartGame = 'NonHostPlayerCannotStartGame',
  PlayerAlreadyExists = 'PlayerAlreadyExists',
  PlayerCannotSubmitNonExistingOrUsedVotingWord = 'PlayerCannotSubmitNonExistingOrUsedVotingWord',
  PlayerCannotSubmitVotingWordWhenVotingItemIsNone = 'PlayerCannotSubmitVotingWordWhenVotingItemIsNone',
  RejectedMatchedPlayerDoesNotExist = 'RejectedMatchedPlayerDoesNotExist',
  RejectedMatchedWordDoesNotExist = 'RejectedMatchedWordDoesNotExist',
  RepeatedWords = 'RepeatedWords',
  RejectedMatchedWordWasNotPickedByPlayer = 'RejectedMatchedWordWasNotPickedByPlayer',
  VotingItemPlayerCannotSubmitVotingWord = 'VotingItemPlayerCannotSubmitVotingWord',
  // External
  UnprocessableWebsocketMessage = 'UnprocessableMessage',
  WebsocketClosed = 'WebsocketClosed',
  // Internal
  Internal = 'Internal',
}

export default GameErrorType;
