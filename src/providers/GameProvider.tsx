import type { GameContext } from "@/types/GameContextType";
import { createContext, PropsWithChildren, useContext } from "react";

import { useGameLogic } from "@/hooks/useGameLogic";

const GameContext = createContext<GameContext | null>(null);

export default function GameProvider({ children }: PropsWithChildren) {
  const gameLogic = useGameLogic();

  return (
    <GameContext.Provider value={gameLogic}>{children}</GameContext.Provider>
  );
}

export const useGameContext = () => {
  const context = useContext(GameContext);

  if (!context) throw new Error("context is null");

  return context;
};
