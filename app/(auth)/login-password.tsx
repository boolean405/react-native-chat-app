import { Image } from "expo-image";
import { Keyboard, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function LoginPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const colorScheme = useColorScheme();
  const router = useRouter();
  const color = colorScheme === "dark" ? "white" : "black";

  const { email } = useLocalSearchParams();

  useEffect(() => {
    password.length < 8
      ? setIsInvalidPassword(true)
      : setIsInvalidPassword(false);
  }, [password]);

  const handleLogin = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setTimeout(() => {
      const dbPassword = "12345678";
      if (password !== dbPassword) {
        setIsError(true);
        setErrorMessage("Incorrect password");
        setIsLoading(false);
        return;
      }
      router.replace("/(tabs)");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Login to your account</ThemedText>
          <ThemedText style={styles.titleText}>
            Enter your login password
          </ThemedText>

          {/* Input container */}
          <View style={[styles.inputContainer, { borderColor: color }]}>
            <Ionicons name="lock-closed-outline" size={24} style={{ color }} />
            <TextInput
              style={[styles.textInput, { color }]}
              placeholder="Password"
              autoComplete="password-new"
              placeholderTextColor="gray"
              value={password}
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              autoCorrect={false}
              editable={!isLoading}
              onSubmitEditing={handleLogin}
              onChangeText={(text) => {
                setIsError(false);
                setIsLoading(false);
                const sanitized = text.replace(/\s/g, "");
                setPassword(sanitized);
              }}
            />

            {/* Right show password icon */}
            <Ionicons
              style={{ color }}
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
          {isError && (
            <ThemedText style={{ color: "red" }}>{errorMessage}</ThemedText>
          )}
          <ThemedButton
            style={[
              styles.button,
              (isInvalidPassword || isLoading || isError) && { opacity: 0.5 }, // dim button when disabled
            ]}
            title={isLoading ? "Processing" : "Login"}
            onPress={handleLogin}
            disabled={isInvalidPassword || isLoading || isError}
          />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  titleText: {
    marginTop: 60,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    width: "80%",
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    width: "80%",
    marginTop: 10,
  },
});
