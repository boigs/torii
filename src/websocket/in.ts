import {
  ChatMessage,
  GameState,
  HeadcrabError,
  HeadcrabErrorType,
  HeadcrabState,
  Player,
  Round,
  VotingItem,
  Word,
} from 'src/domain';

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
  const headcrabError = message as HeadcrabErrorDto;
  return {
    type: headcrabErrorTypeDtoToDomain(headcrabError.type),
    title: headcrabError.title,
    detail: headcrabError.detail,
  };
};

interface GameStateDto {
  players: PlayerDto[];
  rounds: RoundDto[];
  state: string;
  amountOfRounds: number | null;
}

export const gameStateDtoToDomain = (
  message: WsMessageIn,
  you: string
): GameState => {
  const gameState = message as GameStateDto;
  const nicknameToPlayer = new Map(
    gameState.players.map((player) => [
      player.nickname,
      playerDtoToDomain(player),
    ])
  );
  return new GameState({
    you: GameState.getPlayer(nicknameToPlayer, you),
    nicknameToPlayer,
    rounds: gameState.rounds.map((round) =>
      roundDtoToDomain(round, nicknameToPlayer)
    ),
    state: headcrabStateToDomain(gameState.state),
    amountOfRounds: gameState.amountOfRounds,
  });
};

interface ChatMessageDto {
  sender: string;
  content: string;
}

export const chatMessageDtoToDomain = (
  message: WsMessageIn,
  nicknameToPlayer: Map<string, Player>
): ChatMessage => {
  const chatMessage = message as ChatMessageDto;
  return {
    sender: GameState.getPlayer(nicknameToPlayer, chatMessage.sender),
    content: chatMessage.content,
  };
};

const headcrabErrorTypeDtoToDomain = (error: string): HeadcrabErrorType => {
  switch (error) {
    case 'INTERNAL_SERVER':
      return HeadcrabErrorType.Internal;
    case 'WEBSOCKET_CLOSED':
      return HeadcrabErrorType.WebsocketClosed;
    case 'UNPROCESSABLE_WEBSOCKET_MESSAGE':
      return HeadcrabErrorType.UnprocessableMessage;
    case 'COMMAND_NOT_ALLOWED':
      return HeadcrabErrorType.CommandNotAllowed;
    case 'NOT_ENOUGH_PLAYERS':
      return HeadcrabErrorType.NotEnoughPlayers;
    case 'GAME_DOES_NOT_EXIST':
      return HeadcrabErrorType.GameDoesNotExist;
    case 'PLAYER_ALREADY_EXISTS':
      return HeadcrabErrorType.PlayerAlreadyExists;
    case 'REPEATED_WORDS':
      return HeadcrabErrorType.RepeatedWords;
    case 'GAME_ALREADY_IN_PROGRESS':
      return HeadcrabErrorType.GameAlreadyInProgress;
    default:
      throw new Error(
        `Could not deserialize the headcrab error type: ${error}`
      );
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
      throw new Error(`Could not deserialize the headcrab state: ${state}`);
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
  round: RoundDto,
  nicknameToPlayer: Map<string, Player>
): Round => {
  return new Round({
    word: round.word,
    playerWords: new Map(
      Object.entries(round.playerWords).map(([nickname, words]) => [
        GameState.getPlayer(nicknameToPlayer, nickname),
        words.map(wordDtoToDomain),
      ])
    ),
    playerVotingWords: new Map(
      Object.entries(round.playerVotingWords).map(([nickname, word]) => [
        GameState.getPlayer(nicknameToPlayer, nickname),
        word,
      ])
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
  nicknameToPlayer: Map<string, Player>
): VotingItem | null => {
  return item === null
    ? null
    : {
        player: GameState.getPlayer(nicknameToPlayer, item.playerNickname),
        word: item.word,
      };
};
