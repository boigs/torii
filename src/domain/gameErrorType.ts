export enum GameErrorType {
  // Domain
  GameAlreadyInProgress = 'GameAlreadyInProgress',
  GameDoesNotExist = 'GameDoesNotExist',
  InvalidStateForWordsSubmission = 'InvalidStateForWordsSubmission',
  InvalidStateForVotingWordSubmission = 'InvalidStateForVotingWordSubmission',
  NotEnoughPlayers = 'NotEnoughPlayers',
  NotEnoughRounds = 'NotEnoughRounds',
  NonHostPlayerCannotContinueToNextRound = 'NonHostPlayerCannotContinueToNextRound',
  NonHostPlayerCannotContinueToNextVotingItem = 'NonHostPlayerCannotContinueToNextVotingItem',
  NonHostPlayerCannotStartGame = 'NonHostPlayerCannotStartGame',
  PlayerAlreadyExists = 'PlayerAlreadyExists',
  PlayerCannotSubmitNonExistingOrUsedVotingWord = 'PlayerCannotSubmitNonExistingOrUsedVotingWord',
  PlayerCannotSubmitVotingWordWhenVotingItemIsNone = 'PlayerCannotSubmitVotingWordWhenVotingItemIsNone',
  RepeatedWords = 'RepeatedWords',
  VotingItemPlayerCannotSubmitVotingWord = 'VotingItemPlayerCannotSubmitVotingWord',
  NonHostPlayerCannotSendPlayAgain = 'NonHostPlayerCannotSendPlayAgain',
  // External
  UnprocessableWebsocketMessage = 'UnprocessableMessage',
  WebsocketClosed = 'WebsocketClosed',
  // Internal
  Internal = 'Internal',
}

export default GameErrorType;
