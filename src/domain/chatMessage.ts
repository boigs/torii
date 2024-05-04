import Player from './player';

interface ChatMessage {
  readonly sender: Player;
  readonly content: string;
}

export default ChatMessage;
