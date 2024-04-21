interface RoundScore {
  currentPlayer: string;
  currentWord: string;
  playerWordSubmission: Record<string, string>;
}

export default RoundScore;
