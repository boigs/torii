'use client';

import React, { ReactNode, createContext, useEffect, useState } from 'react';

import config from 'src/config';

type GameContextType = {
  gameId?: string;
  nickname?: string;
  setNickname: (nickname: string) => void;
  setGameId: (gameId: string) => void;
};

const GameContext = createContext<GameContextType>({
  nickname: undefined,
  setNickname: () => {},
  setGameId: () => {},
});

const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [nickname, setNickname] = useState<string | undefined>();
  const [gameId, setGameId] = useState<string | undefined>();
  const [websocketUrl, setWebsocketUrl] = useState<string | undefined>();

  useEffect(() => {
    setWebsocketUrl(
      `${config.headcrabWsBaseUrl}/game/${gameId}/player/${nickname}/ws`
    );
  }, [nickname, gameId]);

  return (
    <GameContext.Provider value={{ nickname, setNickname, gameId, setGameId }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext };
export default GameContextProvider;
