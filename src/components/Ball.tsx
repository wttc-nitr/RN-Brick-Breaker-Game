import { ballRadius, ballSpeed, boardHeight } from "@/constants";
import { useGameContext } from "@/GameContext";
import { useWindowDimensions } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
} from "react-native-reanimated";

export default function Ball() {
  const { ball, isUserTurn, onEndTurn } = useGameContext();
  const { width } = useWindowDimensions();
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

    // collision
    if (y < r) {
      // y is ordinate of center
      // console.log("contact");
      y = r; // important, Ball boundary trapping due to inconsistent frame timing:
      dy *= -1;
    }

    if (y > boardHeight - r) {
      y = boardHeight - r; // imp
      dy *= -1;
      onEndTurn();
    }

    if (x < r) {
      x = r; // imp
      dx *= -1;
    }

    if (x > width - r) {
      x = width - r; // imp
      dx *= -1;
    }

    ball.value = {
      ...ball.value,
      x,
      y,
      dy,
      dx,
    };
  }, false); // false -> doesn't autostart

  const startFrameCallback = (val: boolean) => {
    frameCallback.setActive(val);
  };

  useAnimatedReaction(
    () => isUserTurn!.value,
    (val) => runOnJS(startFrameCallback)(!val),
  );

  return <Animated.View style={ballStyles} />;
}
