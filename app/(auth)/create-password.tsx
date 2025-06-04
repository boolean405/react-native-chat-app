import { Image } from "expo-image";
import React, { useState } from "react";
import { useColorScheme } from "react-native";

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

export default function CreatePasswordScreen() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Registering a new account</ThemedText>
          <ThemedText style={styles.emailText}>Create password</ThemedText>

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
              onChangeText={(text) => {
                // Remove spaces and convert to lowercase
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
          <ThemedButton style={styles.button} title="Continue" />
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
  emailText: {
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
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    width: "80%",
    marginVertical: 20,
  },
});
