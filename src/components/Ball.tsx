import { ballRadius, ballSpeed, boardHeight } from "@/constants";
import { useGameContext } from "@/providers/GameProvider";
import { getResetPositionAndDirection } from "@/utils";
import { useRef } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
} from "react-native-reanimated";

export default function Ball() {
  const { ball, isUserTurn, onEndTurn, blocks } = useGameContext();
  const { width } = useWindowDimensions();
  const cnt = useRef(0);
  const ballStyles = useAnimatedStyle(() => {
    if (!ball) return {};
    const { x, y, r } = ball.value;
    return {
      left: x - r,

      // static
      width: r * 2,
      aspectRatio: 1,
      backgroundColor: "white",
      borderRadius: ballRadius,

      position: "absolute",
      top: y - r,
    };
  });

  const frameCallback = useFrameCallback((frameInfo) => {
    // frame-by-frame updates
    if (!ball) return;
    const delta = (frameInfo.timeSincePreviousFrame || 0) / 1000; // convert to seconds
    let { x, y, dx, dy, r } = ball.value;

    // dx & dy denote direction
    x += dx * delta * ballSpeed;
    y += dy * delta * ballSpeed;

    // wall collisions
    if (y < r) {
      // top wall
      // y is ordinate of center
      // console.log("contact");
      y = r; // important, Ball boundary trapping due to inconsistent frame timing:
      dy *= -1; // reverse the vertical direction
    }

    if (y > boardHeight - r) {
      // bottom wall
      y = Math.round(boardHeight - r);
      //y = boardHeight - r; // imp
      dy *= 0; // reverse the vertical direction
      dx *= 0;
      onEndTurn(cnt.current);
      // dy = -1;
    }

    if (x < r) {
      // left wall
      x = r; // imp
      dx *= -1; // reverse the horizontal direction
    }

    if (x > width - r) {
      // right wall
      x = width - r; // imp
      dx *= -1; // reverse horizontal direction
    }

    ball.value = {
      ...ball.value,
      x,
      y,
      dy,
      dx,
    };

    // blocks collision
    blocks?.modify((blocks) => {
      "worklet";

      blocks
        .filter((block) => block.val > 0)
        .some((block) => {
          const newBallData = getResetPositionAndDirection(ball.value, block);
          if (newBallData) {
            cnt.current += 1;

            ball.value = newBallData;
            block.val -= 1;
            // if (block.val <= 0) blocks.splice(index, 1);

            return true;
          }
        });

      return blocks;
    });
  }, false); // false -> doesn't autostart

  const startFrameCallback = (val: boolean) => {
    frameCallback.setActive(val);
  };

  // works like useEffect (on UI thread)
  useAnimatedReaction(
    () => isUserTurn!.value,
    (val) => runOnJS(startFrameCallback)(!val),
  );

  return <Animated.View style={ballStyles} />;
}
