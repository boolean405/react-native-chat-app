import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Keyboard, useColorScheme } from "react-native";

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
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black";

  const router = useRouter();

  useEffect(() => {
    validateEmail(email) ? setIsInvalidEmail(false) : setIsInvalidEmail(true);
  }, [email]);

  // Simple email validation regex
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleContinue = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const existEmail = "boolean405@gmail.com";
      if (email === existEmail) {
        router.push({
          pathname: "/(auth)/verify-email",
          params: { email },
        });
      } else {
        router.push({
          pathname: "/(auth)/register-password",
          params: { email },
        });
      }
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
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
          <ThemedText type="subtitle">Reset Password</ThemedText>
          <ThemedText style={styles.titleText}>
            Enter your email address to reset a new password
          </ThemedText>

          {/* Input container */}
          <View style={[styles.inputContainer, { borderColor: color }]}>
            <Ionicons name="mail-outline" size={24} style={[{ color }]} />
            <TextInput
              style={[styles.textInput, { color }]}
              placeholder="Email"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              placeholderTextColor="gray"
              value={email}
              autoCapitalize="none"
              editable={!isLoading}
              onSubmitEditing={handleContinue}
              onChangeText={(text) => {
                setIsError(false);
                const sanitized = text.replace(/\s/g, "").toLowerCase();
                setEmail(sanitized);
              }}
            />
          </View>
          {isError && (
            <ThemedText style={{ color: "red" }}>{errorMessage}</ThemedText>
          )}

          {/* Continue button */}
          <ThemedButton
            style={[
              styles.button,
              (isInvalidEmail || isLoading || isError) && { opacity: 0.5 }, // dim button when disabled
            ]}
            title={isLoading ? "Processing" : "Continue"}
            disabled={isInvalidEmail || isLoading || isError}
            onPress={handleContinue}
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
    marginVertical: 10,
  },
});
