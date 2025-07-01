import { ballRadius, boardHeight } from "@/constants";
import { GameContext } from "@/GameContext";
import type { BallData } from "@/types";
import React from "react";
import { Button, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Ball from "./Ball";

export default function Game() {
  const { width } = useWindowDimensions();
  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1,
    dy: -1,
  });

  return (
    <SafeAreaView style={styles.container}>
      <GameContext.Provider value={{ ball }}>
        <View style={styles.board}>
          <Ball />
        </View>
      </GameContext.Provider>
      <Button title="Move" onPress={() => {}} />
    </SafeAreaView>
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
