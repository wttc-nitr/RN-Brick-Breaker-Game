import { PanGesture } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";
import { BallData, BlockData } from "./GameTypes";

export type GameContext = {
  ball: SharedValue<BallData>;
  isUserTurn: SharedValue<boolean>;
  blocks: SharedValue<BlockData[]>;
  onEndTurn: (val: number) => void;
  score: number;
  panGesture: PanGesture;
  pathStyle: {
    display: "none" | "flex";
    top: number;
    left: number;
    transform: {
      rotate: string;
    }[];
  };
};
