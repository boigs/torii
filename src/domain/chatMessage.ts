class ChatMessage {
  private readonly _sender: string;
  private readonly _content: string;

  constructor(sender: string, content: string) {
    this._sender = sender;
    this._content = content;
  }

  get sender(): string {
    return this._sender;
  }

  get content(): string {
    return this._content;
  }
}

export default ChatMessage;
