import { ballRadius, boardHeight } from "@/constants";
import { GameContext } from "@/GameContext";
import type { BallData } from "@/types";
import React from "react";
import { Button, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Ball from "./Ball";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function Game() {
  const { width } = useWindowDimensions();
  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1,
    dy: -1,
  });

  const isUserTurn = useSharedValue(true);
  const onEndTurn = () => {
    "worklet";
    if (isUserTurn.value) return;

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

  return (
    <GestureDetector gesture={pan}>
      <SafeAreaView style={styles.container}>
        <GameContext.Provider value={{ ball, isUserTurn, onEndTurn }}>
          <View style={styles.board}>
            <Ball />
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
