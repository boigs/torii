import { renderHook } from '@testing-library/react';
import { Mocked } from 'vitest';
import { ActorRefFrom } from 'xstate';

import { useGameContext } from 'src/components/GameContextProvider';
import { GameContextType } from 'src/components/GameContextProvider/GameContextProvider';
import GameState from 'src/domain/gameState';
import Player from 'src/domain/player';
import gameFsm from 'src/fsm';
import { chatMessage } from 'src/websocket/out';

import { useChat } from '../useChat';

vi.mock('src/components/GameContextProvider');

describe('useChat...', () => {
  const mockedUseGameContext = vi.mocked(useGameContext);

  const mockedBaseGameContext: GameContextType = {
    sendWebsocketMessage: vi.fn(),
    gameActor: {} as Mocked<ActorRefFrom<typeof gameFsm>>,
    game: {} as Mocked<GameState>,
    lastChatMessage: null,
    isInsideOfGame: false,
  };

  it('should send a websocket message when sending a chat message', async () => {
    const mockedSendWsMessage = vi.fn();

    mockedUseGameContext.mockReturnValue({
      ...mockedBaseGameContext,
      sendWebsocketMessage: mockedSendWsMessage,
    });

    const { result } = renderHook(() => useChat());

    await result.current.sendChatMessage('message');

    expect(mockedSendWsMessage).toHaveBeenCalledWith(
      chatMessage({ content: 'message' }),
    );
  });

  it('should append chat messages when received through the websocket', () => {
    mockedUseGameContext.mockReturnValue({
      ...mockedBaseGameContext,
      lastChatMessage: null,
    });

    const { result, rerender } = renderHook(() => useChat());

    expect(result.current.chatMessages).toHaveLength(0);

    const anyMessage = { sender: {} as Mocked<Player>, content: 'any-content' };

    mockedUseGameContext.mockReturnValue({
      ...mockedBaseGameContext,
      lastChatMessage: anyMessage,
    });

    rerender();

    expect(result.current.chatMessages).toContain(anyMessage);
  });
});
