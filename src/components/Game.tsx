import { boardHeight } from "@/constants";
import React from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import Animated from "react-native-reanimated";
import Ball from "./Ball";
import { GestureDetector } from "react-native-gesture-handler";
import Block from "./Block";
import GameProvider, { useGameContext } from "@/providers/GameProvider";

export default function Game() {
  const { panGesture, score, blocks, pathStyle } = useGameContext();

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 40, fontWeight: "bold", color: "gray" }}>
            Score: {score}
          </Text>
        </View>
        <View style={styles.board}>
          {blocks.value.map((block, index) => (
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
      </View>
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
