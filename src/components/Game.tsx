import { ballRadius, blockW, boardHeight } from "@/constants";
import { GameContext } from "@/GameContext";
import type { BlockData, BallData } from "@/types";
import React from "react";
import { Button, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Ball from "./Ball";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Block from "./Block";
import { generateBlocksRow } from "@/utils";

export default function Game() {
  const { width } = useWindowDimensions();
  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1, // negative, go left
    dy: -1, // negative, go up
  });

  const blocks = useSharedValue<BlockData[]>(
    Array.from({ length: 3 }).flatMap((_, row) => generateBlocksRow(row + 1)),
  );

  const isUserTurn = useSharedValue(true);
  const onEndTurn = () => {
    "worklet";
    if (isUserTurn.value) return;

    blocks?.modify((blocks) => {
      blocks.forEach((block) => {
        block.y += block.w;
      });

      return blocks;
    });

    isUserTurn.value = true;
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (!isUserTurn.value) {
        // if not our turn
        return;
      }
      // distance the gesture has covered (from starting point to current position)
      const x = e.translationX,
        y = e.translationY;

      const mag = Math.sqrt(x * x + y * y);

      ball.value = {
        ...ball.value,
        dx: -x / mag, // negative, bcoz now we want to pull (like an arrow)
        dy: -y / mag, // negative, bcoz now we want to pull (like an arrow)
      };

      // console.log("dragging", x, y);
    })
    .onEnd(() => {
      // move the ball on gesture end
      if (ball.value.dy < 0) {
        // if direction is upwards then only move the ball, moving a negative-y-distance means move up
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

  return (
    <GestureDetector gesture={pan}>
      <SafeAreaView style={styles.container}>
        <GameContext.Provider value={{ ball, isUserTurn, onEndTurn, blocks }}>
          <View style={styles.board}>
            {blocks.value.map((_block, index) => (
              <Block key={index} index={index} />
            ))}
            <Ball />

            {/* ball trajectory */}
            <Animated.View
              style={[
                {
                  height: 1000,
                  width: 0,
                  borderWidth: 1,
                  borderColor: "#ffffff99",
                  borderStyle: "dashed",
                  position: "absolute",
                  left: 50,
                  transformOrigin: "top-center",
                },
                pathStyle,
              ]}
            />
          </View>
        </GameContext.Provider>
        <Button
          title="Move"
          onPress={() => {
            isUserTurn.value = false;
          }}
        />
      </SafeAreaView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
  },
  board: {
    backgroundColor: "#202020",
    height: boardHeight,
    marginVertical: "auto",
    overflow: "hidden",
  },
});
