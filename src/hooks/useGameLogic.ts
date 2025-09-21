import { ballRadius, blockW, boardHeight } from "@/constants";

import type { BlockData, BallData } from "@/types/GameTypes";
import { generateBlocksRow } from "@/utils";
import { useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const { width } = useWindowDimensions();
  const [push, setPushRerender] = useState(false);

  const incrementScore = (val: number) => {
    // console.log("in useGameLogic, val is: ", val);
    if (val === 0) setPushRerender((x) => !x);
    else setScore((x) => x + val);
  };

  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1,
    dy: -1,
  });

  const isUserTurn = useSharedValue(true);
  const blocks = useSharedValue<BlockData[]>(
    Array.from({ length: 3 }).flatMap((_, row) => generateBlocksRow(row + 1)),
  );

  const onEndTurn = (val: number) => {
    "worklet";

    if (isUserTurn.value) return;
    isUserTurn.value = true;

    blocks?.modify((blocks) => {
      blocks.forEach((block) => {
        block.y += blockW + 10;
      });

      blocks.push(...generateBlocksRow(1));
      return blocks;
    });

    runOnJS(incrementScore)(val);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (!isUserTurn.value) return;

      const x = e.translationX,
        y = e.translationY;
      const mag = Math.sqrt(x * x + y * y);

      ball.value = {
        ...ball.value,
        dx: -x / mag,
        dy: -y / mag,
      };
    })
    .onEnd(() => {
      if (ball.value.dy < 0) {
        isUserTurn.value = false;
      }
    });

  const pathStyle = useAnimatedStyle(() => {
    const { x, y, dx, dy } = ball.value;
    const angle = Math.atan2(-dx, dy);
    return {
      display: isUserTurn.value ? "flex" : "none",
      top: y,
      left: x - 0.5,
      transform: [
        {
          rotate: `${angle}rad`,
        },
      ],
    };
  });

  return {
    ball,
    isUserTurn,
    blocks,
    onEndTurn,
    score,
    panGesture,
    pathStyle,
  };
};
