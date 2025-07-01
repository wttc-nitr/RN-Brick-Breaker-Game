import { createContext, useContext } from "react";
import { SharedValue } from "react-native-reanimated";
import type { BallData } from "./types";

export const GameContext = createContext<{ ball?: SharedValue<BallData> }>({});

export const useGameContext = () => useContext(GameContext);
