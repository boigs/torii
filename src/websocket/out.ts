export interface WsMessageOut {
  kind: string;
}

export interface StartGameOptions {
  amountOfRounds: number;
}

export const startGame: (options: StartGameOptions) => WsMessageOut = (
  options
) => ({
  kind: 'startGame',
  ...options,
});

export interface ChatMessageOptions {
  content: string;
}

export const chatMessage: (options: ChatMessageOptions) => WsMessageOut = (
  options
) => ({
  kind: 'chatMessage',
  ...options,
});

export interface PlayerWordsOptions {
  words: string[];
}

export const playerWords: (options: PlayerWordsOptions) => WsMessageOut = (
  options
) => ({
  kind: 'playerWords',
  ...options,
});

export interface PlayerVotingWordOptions {
  word: string | null;
}

export const playerVotingWord: (
  options: PlayerVotingWordOptions
) => WsMessageOut = (options) => ({
  kind: 'playerVotingWord',
  ...options,
});

export const acceptPlayersVotingWords: () => WsMessageOut = () => ({
  kind: 'acceptPlayersVotingWords',
});
