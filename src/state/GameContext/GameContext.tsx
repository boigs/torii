'use client';

import React, { ReactNode, createContext, useState } from 'react';

type GameContextType = {};

const GameContext = createContext<GameContextType>({});

const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [websocketUrl, setWebsocketUrl] = useState<string | null>(null);

  return <GameContext.Provider value={{}}>{children}</GameContext.Provider>;
};

export { GameContext };
export default GameContextProvider;
