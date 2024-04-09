export type StartGameOptions = {
  amountOfRounds: number;
};

export type PlayerWordSubmission = {
  word: string;
};

export type WsMessageOut = {
  kind: string;
};

export const startGameMessage: (options: StartGameOptions) => WsMessageOut = (
  options
) => ({
  kind: 'startGame',
  ...options,
});

export const chatMessage: (content: string) => WsMessageOut = (content) => ({
  kind: 'chatMessage',
  content,
});

export const playerWordsMessage: (words: string[]) => WsMessageOut = (
  words
) => ({
  kind: 'playerWords',
  words,
});

export const submitPlayerWordForScoringMessage: (
  word: string
) => WsMessageOut = (word) => ({
  kind: 'playerWordSubmission',
  word,
});
