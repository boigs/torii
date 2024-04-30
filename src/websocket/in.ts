import ChatMessage from 'src/domain/chatMessage';
import GameState from 'src/domain/gameState';
import HeadcrabError from 'src/domain/headcrabError';
import HeadCrabErrorType from 'src/domain/headcrabErrorType';
import HeadcrabState from 'src/domain/headcrabState';
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
  (GameStateDto | HeadcrabError | ChatMessageDto);

interface HeadcrabErrorDto {
  type: string;
  title: string;
  detail: string;
}

export const headcrabErrorDtoToDomain = (
  message: WsMessageIn
): HeadcrabError => {
  const error = message as unknown as HeadcrabErrorDto;
  return new HeadcrabError(
    headcrabErrorTypeDtoToDomain(error.type),
    error.title,
    error.detail
  );
};

interface GameStateDto {
  players: PlayerDto[];
  rounds: RoundDto[];
  state: string;
}

export const gameStateDtoToDomain = (message: WsMessageIn): GameState => {
  const state = message as GameStateDto;
  return new GameState(
    state.players.map((player) => playerDtoToDomain(player)),
    state.rounds.map((round) => roundDtoToDomain(round)),
    headcrabStateToDomain(state.state)
  );
};

interface ChatMessageDto {
  sender: string;
  content: string;
}

export const chatMessageDtoToDomain = (message: WsMessageIn): ChatMessage => {
  const chatMessage = message as ChatMessageDto;
  return new ChatMessage(chatMessage.sender, chatMessage.content);
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
  return new Player(player.nickname, player.isHost, player.isConnected);
};

interface RoundDto {
  word: string;
  playerWords: Record<string, WordDto[]>;
  playerVotingWords: Record<string, string | null | undefined>;
  votingItem: VotingItemDto | null | undefined;
}

const roundDtoToDomain = (round: RoundDto): Round => {
  return new Round(
    round.word,
    new Map(
      Array.from(Object.entries(round.playerWords), ([nickname, words]) => [
        nickname,
        words.map((word) => wordDtoToDomain(word)),
      ])
    ),
    new Map(
      Array.from(
        Object.entries(round.playerVotingWords),
        ([nickname, votingWord]) => [
          nickname,
          votingWord === undefined ? null : votingWord,
        ]
      )
    ),
    votingItemDtoToDomain(round.votingItem)
  );
};

interface WordDto {
  word: string;
  isUsed: boolean;
  score: number;
}

const wordDtoToDomain = (word: WordDto): Word => {
  return new Word(word.word, word.isUsed, word.score);
};

interface VotingItemDto {
  playerNickname: string;
  word: string;
}

const votingItemDtoToDomain = (
  item: VotingItemDto | null | undefined
): VotingItem | null => {
  return item === undefined || item === null
    ? null
    : new VotingItem(item.playerNickname, item.word);
};
