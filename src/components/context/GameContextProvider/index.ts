import { useContext } from 'react';

import { GameContext, GameContextType } from './GameContextProvider';

export { GameContextProvider } from './GameContextProvider';

export const useGameContext = (): GameContextType => useContext(GameContext);

export type { GameContextType } from './GameContextProvider';
