type RoundScore = {
  currentPlayer: string;
  currentWord: string;
  playerWordSubmission: { [nickname: string]: string };
};

export default RoundScore;
