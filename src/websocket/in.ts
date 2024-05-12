import ChatMessage from 'src/domain/chatMessage';
import Game from 'src/domain/game';
import GameError from 'src/domain/gameError';
import GameErrorType from 'src/domain/gameErrorType';
import GameState from 'src/domain/gameState';
import Player from 'src/domain/player';
import Round from 'src/domain/round';
import VotingItem from 'src/domain/votingItem';
import Word from 'src/domain/word';

export enum WsTypeIn {
  Error = 'error',
  GameState = 'gameState',
  ChatText = 'chatMessage',
}

export interface MessageTypeIn {
  kind: WsTypeIn;
}

export type WsMessageIn = MessageTypeIn &
  (GameStateDto | ChatMessageDto | GameErrorDto);

interface GameErrorDto {
  type: string;
  title: string;
  detail: string;
}

export const gameErrorDtoToDomain = (message: WsMessageIn): GameError => {
  const gameError = message as GameErrorDto;
  return {
    type: gameErrorTypeDtoToDomain(gameError.type),
    title: gameError.title,
    detail: gameError.detail,
  };
};

interface GameStateDto {
  players: PlayerDto[];
  rounds: RoundDto[];
  state: string;
  amountOfRounds: number | null;
}

export const gameDtoToDomain = (
  message: WsMessageIn,
  gameId: string,
  nickname: string,
): Game => {
  const gameState = message as GameStateDto;
  const nicknameToPlayer = new Map(
    gameState.players.map((player) => [
      player.nickname,
      playerDtoToDomain(player),
    ]),
  );
  return new Game({
    id: gameId,
    player: getPlayer(nicknameToPlayer, nickname),
    nicknameToPlayer,
    rounds: gameState.rounds.map((round, roundIndex) =>
      roundDtoToDomain(roundIndex, round, nicknameToPlayer),
    ),
    state: gameStateToDomain(gameState.state),
    amountOfRounds: gameState.amountOfRounds,
  });
};

interface ChatMessageDto {
  sender: string;
  content: string;
}

export const chatMessageDtoToDomain = (
  message: WsMessageIn,
  nicknameToPlayer: Map<string, Player>,
): ChatMessage => {
  const chatMessage = message as ChatMessageDto;
  return {
    sender: getPlayer(nicknameToPlayer, chatMessage.sender),
    content: chatMessage.content,
  };
};

const gameErrorTypeDtoToDomain = (error: string): GameErrorType => {
  switch (error) {
    // Domain
    case 'GAME_ALREADY_IN_PROGRESS':
      return GameErrorType.GameAlreadyInProgress;
    case 'GAME_DOES_NOT_EXIST':
      return GameErrorType.GameDoesNotExist;
    case 'INVALID_STATE_FOR_WORDS_SUBMISSION':
      return GameErrorType.InvalidStateForWordsSubmission;
    case 'INVALID_STATE_FOR_VOTING_WORD_SUBMISSION':
      return GameErrorType.InvalidStateForVotingWordSubmission;
    case 'NOT_ENOUGH_PLAYERS':
      return GameErrorType.NotEnoughPlayers;
    case 'NOT_ENOUGH_ROUNDS':
      return GameErrorType.NotEnoughRounds;
    case 'NON_HOST_PLAYER_CANNOT_CONTINUE_TO_NEXT_ROUND':
      return GameErrorType.NonHostPlayerCannotContinueToNextRound;
    case 'NON_HOST_PLAYER_CANNOT_CONTINUE_TO_NEXT_VOTING_ITEM':
      return GameErrorType.NonHostPlayerCannotContinueToNextVotingItem;
    case 'NON_HOST_PLAYER_CANNOT_START_GAME':
      return GameErrorType.NonHostPlayerCannotStartGame;
    case 'PLAYER_ALREADY_EXISTS':
      return GameErrorType.PlayerAlreadyExists;
    case 'PLAYER_CANNOT_SUBMIT_NON_EXISTING_OR_USED_WORD':
      return GameErrorType.PlayerCannotSubmitNonExistingOrUsedVotingWord;
    case 'PLAYER_CANNOT_SUBMIT_VOTING_WORD_WHEN_VOTING_ITEM_IS_NONE':
      return GameErrorType.PlayerCannotSubmitVotingWordWhenVotingItemIsNone;
    case 'REPEATED_WORDS':
      return GameErrorType.RepeatedWords;
    case 'VOTING_ITEM_PLAYER_CANNOT_SUBMIT_VOTING_WORD':
      return GameErrorType.VotingItemPlayerCannotSubmitVotingWord;
    // External
    case 'UNPROCESSABLE_WEBSOCKET_MESSAGE':
      return GameErrorType.UnprocessableWebsocketMessage;
    case 'WEBSOCKET_CLOSED':
      return GameErrorType.WebsocketClosed;
    // Internal
    case 'INTERNAL':
      return GameErrorType.Internal;
    default:
      throw new Error(`Could not deserialize the game error type: ${error}`);
  }
};

const gameStateToDomain = (state: string): GameState => {
  switch (state) {
    case 'Lobby':
      return GameState.Lobby;
    case 'PlayersSubmittingWords':
      return GameState.PlayersSubmittingWords;
    case 'PlayersSubmittingVotingWord':
      return GameState.PlayersSubmittingVotingWord;
    case 'EndOfRound':
      return GameState.EndOfRound;
    case 'EndOfGame':
      return GameState.EndOfGame;
    default:
      throw new Error(`Could not deserialize the game state: ${state}`);
  }
};

interface PlayerDto {
  nickname: string;
  isHost: boolean;
  isConnected: boolean;
}

const playerDtoToDomain = (player: PlayerDto): Player => {
  return {
    nickname: player.nickname,
    isHost: player.isHost,
    isConnected: player.isConnected,
  };
};

interface RoundDto {
  word: string;
  playerWords: Record<string, WordDto[]>;
  playerVotingWords: Record<string, string | null>;
  votingItem: VotingItemDto | null;
}

const roundDtoToDomain = (
  roundIndex: number,
  round: RoundDto,
  nicknameToPlayer: Map<string, Player>,
): Round => {
  return new Round({
    index: roundIndex,
    word: round.word,
    playerWords: new Map(
      Object.entries(round.playerWords).map(([nickname, words]) => [
        getPlayer(nicknameToPlayer, nickname),
        words.map(wordDtoToDomain),
      ]),
    ),
    playerVotingWords: new Map(
      Object.entries(round.playerVotingWords).map(([nickname, word]) => [
        getPlayer(nicknameToPlayer, nickname),
        word,
      ]),
    ),
    votingItem: votingItemDtoToDomain(round.votingItem, nicknameToPlayer),
  });
};

interface WordDto {
  word: string;
  isUsed: boolean;
  score: number;
}

const wordDtoToDomain = (word: WordDto): Word => {
  return { ...word, value: word.word };
};

interface VotingItemDto {
  playerNickname: string;
  word: string;
}

const votingItemDtoToDomain = (
  item: VotingItemDto | null,
  nicknameToPlayer: Map<string, Player>,
): VotingItem | null => {
  return item === null
    ? null
    : {
        player: getPlayer(nicknameToPlayer, item.playerNickname),
        word: item.word,
      };
};

const getPlayer = (
  nicknameToPlayer: Map<string, Player>,
  nickname: string,
): Player => {
  const player = nicknameToPlayer.get(nickname);
  if (player === undefined) {
    throw new Error(`Could not find the player '${nickname}'`);
  }
  return player;
};
