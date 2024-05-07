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
  message: WsMessageIn,
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
  nickname: string,
): GameState => {
  const gameState = message as GameStateDto;
  const nicknameToPlayer = new Map(
    gameState.players.map((player) => [
      player.nickname,
      playerDtoToDomain(player),
    ]),
  );
  return new GameState({
    player: getPlayer(nicknameToPlayer, nickname),
    nicknameToPlayer,
    rounds: gameState.rounds.map((round, roundIndex) =>
      roundDtoToDomain(roundIndex, round, nicknameToPlayer),
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
  nicknameToPlayer: Map<string, Player>,
): ChatMessage => {
  const chatMessage = message as ChatMessageDto;
  return {
    sender: getPlayer(nicknameToPlayer, chatMessage.sender),
    content: chatMessage.content,
  };
};

const headcrabErrorTypeDtoToDomain = (error: string): HeadcrabErrorType => {
  switch (error) {
    // Domain
    case 'GAME_ALREADY_IN_PROGRESS':
      return HeadcrabErrorType.GameAlreadyInProgress;
    case 'GAME_DOES_NOT_EXIST':
      return HeadcrabErrorType.GameDoesNotExist;
    case 'INVALID_STATE_FOR_WORDS_SUBMISSION':
      return HeadcrabErrorType.InvalidStateForWordsSubmission;
    case 'INVALID_STATE_FOR_VOTING_WORD_SUBMISSION':
      return HeadcrabErrorType.InvalidStateForVotingWordSubmission;
    case 'NOT_ENOUGH_PLAYERS':
      return HeadcrabErrorType.NotEnoughPlayers;
    case 'NOT_ENOUGH_ROUNDS':
      return HeadcrabErrorType.NotEnoughRounds;
    case 'NON_HOST_PLAYER_CANNOT_CONTINUE_TO_NEXT_ROUND':
      return HeadcrabErrorType.NonHostPlayerCannotContinueToNextRound;
    case 'NON_HOST_PLAYER_CANNOT_CONTINUE_TO_NEXT_VOTING_ITEM':
      return HeadcrabErrorType.NonHostPlayerCannotContinueToNextVotingItem;
    case 'NON_HOST_PLAYER_CANNOT_START_GAME':
      return HeadcrabErrorType.NonHostPlayerCannotStartGame;
    case 'PLAYER_ALREADY_EXISTS':
      return HeadcrabErrorType.PlayerAlreadyExists;
    case 'PLAYER_CANNOT_SUBMIT_NON_EXISTING_OR_USED_WORD':
      return HeadcrabErrorType.PlayerCannotSubmitNonExistingOrUsedVotingWord;
    case 'PLAYER_CANNOT_SUBMIT_VOTING_WORD_WHEN_VOTING_ITEM_IS_NONE':
      return HeadcrabErrorType.PlayerCannotSubmitVotingWordWhenVotingItemIsNone;
    case 'REPEATED_WORDS':
      return HeadcrabErrorType.RepeatedWords;
    case 'VOTING_ITEM_PLAYER_CANNOT_SUBMIT_VOTING_WORD':
      return HeadcrabErrorType.VotingItemPlayerCannotSubmitVotingWord;
    // External
    case 'UNPROCESSABLE_WEBSOCKET_MESSAGE':
      return HeadcrabErrorType.UnprocessableWebsocketMessage;
    case 'WEBSOCKET_CLOSED':
      return HeadcrabErrorType.WebsocketClosed;
    // Internal
    case 'INTERNAL':
      return HeadcrabErrorType.Internal;
    default:
      throw new Error(
        `Could not deserialize the headcrab error type: ${error}`,
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
