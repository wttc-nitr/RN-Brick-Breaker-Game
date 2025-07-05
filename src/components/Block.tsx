import { useGameContext } from "@/GameContext";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function Block({ index }: { index: number }) {
  const { blocks } = useGameContext();
  const styles = useAnimatedStyle(() => {
    if (!blocks || !blocks.value[index] || blocks.value[index].val <= 0) {
      return { display: "none" };
    }

    const block = blocks.value[index];
    const { x, y, w, val } = block;

    return {
      width: w,
      height: w,
      position: "absolute",
      left: x,
      top: withTiming(y),
      backgroundColor: "orange",
    };
  });
  return <Animated.View style={styles} />;
}
