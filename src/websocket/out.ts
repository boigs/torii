export type StartGameOptions = {
  amountOfRounds: number;
};

export type WsMessageOut = {
  kind: string;
};

export const newStartGameMessage: (
  options: StartGameOptions
) => WsMessageOut = (options) => ({
  kind: 'startGame',
  ...options,
});

export const newWordAdded: (word: string) => WsMessageOut = (word) => ({
  kind: 'wordAdded',
  word,
});

export const newChatMessage: (content: string) => WsMessageOut = (content) => ({
  kind: 'chatMessage',
  content,
});

export const newPlayerWordsMessage: (words: string[]) => WsMessageOut = (
  words
) => ({
  kind: 'playerWords',
  words,
});
