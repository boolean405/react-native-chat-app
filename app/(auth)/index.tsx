import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getUserData } from "@/stores/authStore";

const { width } = Dimensions.get("window");

export default function FlashScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    // Pulsing animation on logo
    const loadingFlash = Animated.loop(
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

    loadingFlash.start();

    // TODO: Enable auth check to auto-navigate
    const checkAuth = async () => {
      const user = await getUserData();
      setTimeout(() => {
        router.replace(user ? "/(tabs)" : "/(auth)/login-or-register");
      }, 1000);
    };
    checkAuth();

    return () => loadingFlash.stop(); // Clean up animation loop
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Animated logo + header */}
      <Animated.View
        style={[styles.topIllustration, { transform: [{ scale: scaleAnim }] }]}
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
    width: width * 0.5,
    height: width * 0.5,
  },
  header: {
    alignItems: "center",
  },
  title: {
    marginBottom: 10,
  },
});
