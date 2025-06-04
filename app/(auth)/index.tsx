import { Image } from "expo-image";
const { width } = Dimensions.get("window");
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
// import { getUserData } from "../../store/authStore";

export default function FlashScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    const checkAuth = async () => {
      // const user = await getUserData();
      // // Optional: wait for animation or splash effect
      // setTimeout(() => {
      //   if (user) {
      //     router.replace("/(tabs)"); // go to home screen
      //   } else {
      //     router.replace("/(auth)/signin"); // go to sign-in screen
      //   }
      // }, 1000); // adjust timeout as needed
    };

    checkAuth();

    return () => pulse.stop(); // Clean up
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={[
          styles.topIllustration,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.illustrationImage}
          contentFit="contain"
        />
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            K Khay
          </ThemedText>
          <ThemedText type="subtitle">Explore the World</ThemedText>
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topIllustration: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationImage: {
    width: width * 0.75,
    height: width * 0.75,
  },
  header: {
    alignItems: "center",
  },
  title: {
    marginBottom: 10,
  },
});
