export interface StartGameOptions {
  amountOfRounds: number;
}

export interface PlayerWordSubmission {
  word: string;
}

export interface WsMessageOut {
  kind: string;
}

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
  word: string | null
) => WsMessageOut = (word) => ({
  kind: 'playerWordSubmission',
  word,
});
