import {
  ChatMessage,
  GameState,
  HeadCrabErrorType,
  HeadcrabError,
  Player,
  Round,
  VotingItem,
  Word,
} from 'src/domain';
import HeadcrabState from 'src/domain/headcrabState';

export enum WsTypeIn {
  Error = 'error',
  GameState = 'gameState',
  ChatText = 'chatMessage',
}

export interface MessageTypeIn {
  kind: WsTypeIn;
}

export type WsMessageIn = MessageTypeIn &
  (GameStateDto | HeadcrabErrorDto | ChatMessageDto);

interface HeadcrabErrorDto {
  type: string;
  title: string;
  detail: string;
}

export const headcrabErrorDtoToDomain = (
  message: WsMessageIn
): HeadcrabError => {
  const error = message as HeadcrabErrorDto;
  return {
    type: headcrabErrorTypeDtoToDomain(error.type),
    title: error.title,
    detail: error.detail,
  };
};

interface GameStateDto {
  players: PlayerDto[];
  rounds: RoundDto[];
  state: string;
}

export const gameStateDtoToDomain = (message: WsMessageIn): GameState => {
  const state = message as GameStateDto;
  return new GameState({
    players: state.players.map((player) => playerDtoToDomain(player)),
    rounds: state.rounds.map((round) => roundDtoToDomain(round)),
    state: headcrabStateToDomain(state.state),
  });
};

interface ChatMessageDto {
  sender: string;
  content: string;
}

export const chatMessageDtoToDomain = (message: WsMessageIn): ChatMessage => {
  const chatMessage = message as ChatMessageDto;
  return { sender: chatMessage.sender, content: chatMessage.content };
};

const headcrabErrorTypeDtoToDomain = (error: string): HeadCrabErrorType => {
  switch (error) {
    case 'INTERNAL_SERVER':
      return HeadCrabErrorType.Internal;
    case 'WEBSOCKET_CLOSED':
      return HeadCrabErrorType.WebsocketClosed;
    case 'UNPROCESSABLE_WEBSOCKET_MESSAGE':
      return HeadCrabErrorType.UnprocessableMessage;
    case 'COMMAND_NOT_ALLOWED':
      return HeadCrabErrorType.CommandNotAllowed;
    case 'NOT_ENOUGH_PLAYERS':
      return HeadCrabErrorType.NotEnoughPlayers;
    case 'GAME_DOES_NOT_EXIST':
      return HeadCrabErrorType.GameDoesNotExist;
    case 'PLAYER_ALREADY_EXISTS':
      return HeadCrabErrorType.PlayerAlreadyExists;
    case 'REPEATED_WORDS':
      return HeadCrabErrorType.RepeatedWords;
    case 'GAME_ALREADY_IN_PROGRESS':
      return HeadCrabErrorType.GameAlreadyInProgress;
    default:
      throw `Could not deserialize the Headcrab error type. headcrab_error_type: ${error}`;
  }
};

const headcrabStateToDomain = (state: string): HeadcrabState => {
  switch (state) {
    case 'Lobby':
      return HeadcrabState.Lobby;
    case 'PlayersSubmittingWords':
      return HeadcrabState.PlayersSubmittingWords;
    case 'PlayersSubmittingVotingWord':
      return HeadcrabState.PlayersSubmittingVotingWord;
    case 'EndOfRound':
      return HeadcrabState.EndOfRound;
    case 'EndOfGame':
      return HeadcrabState.EndOfGame;
    default:
      throw `Could not deserialize the Headcrab state. headcrab_state: ${state}`;
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

const roundDtoToDomain = (round: RoundDto): Round => {
  return new Round({
    word: round.word,
    playerWords: new Map(
      Object.entries(round.playerWords).map(([nickname, words]) => [
        nickname,
        words.map((word) => wordDtoToDomain(word)),
      ])
    ),
    playerVotingWords: new Map(
      Object.entries(round.playerVotingWords).map(([nickname, votingWord]) => [
        nickname,
        votingWord,
      ])
    ),
    votingItem: votingItemDtoToDomain(round.votingItem),
  });
};

interface WordDto {
  word: string;
  isUsed: boolean;
  score: number;
}

const wordDtoToDomain = (word: WordDto): Word => {
  return { value: word.word, isUsed: word.isUsed, score: word.score };
};

interface VotingItemDto {
  playerNickname: string;
  word: string;
}

const votingItemDtoToDomain = (
  item: VotingItemDto | null
): VotingItem | null => {
  return item === null
    ? null
    : { nickname: item.playerNickname, word: item.word };
};
