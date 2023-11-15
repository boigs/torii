export type StartGameOptions = {
  amountOfRounds: number;
};

export type WsMessageOut = {
  type: string;
};

export const newStartGameMessage: (
  options: StartGameOptions
) => WsMessageOut = (options) => ({
  type: 'startGame',
  ...options,
});

export const newWordAdded: (word: string) => WsMessageOut = (word) => ({
  type: 'wordAdded',
  word,
});

export const newChatMessage: (text: string) => WsMessageOut = (text) => ({
  type: 'chatText',
  text,
});
