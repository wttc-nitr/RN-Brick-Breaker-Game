import Game from "@/components/Game";
import GameProvider from "@/providers/GameProvider";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={colorScheme === "dark" ? "black" : "white"}
        style={colorScheme === "dark" ? "light" : "dark"}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GameProvider>
            <Game />
          </GameProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
