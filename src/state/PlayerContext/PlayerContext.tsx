'use client';

import React, { ReactNode, createContext } from 'react';

type PlayerContextType = {};

const PlayerContext = createContext<PlayerContextType>({});

const PlayerContextProvider = ({ children }: { children: ReactNode }) => {
  return <PlayerContext.Provider value={{}}>{children}</PlayerContext.Provider>;
};

export { PlayerContext };
export default PlayerContextProvider;
