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

export default function LoginOrRegisterScreen() {
  const [email, setEmail] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <Image
            style={styles.logoImage}
            source={require("@/assets/images/logo.png")}
          />
          <ThemedText type="title">K Khay</ThemedText>
          <ThemedText type="subtitle" style={styles.emailText}>
            Enter your email address
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
              onChangeText={(text) => {
                // Remove spaces and convert to lowercase
                const sanitized = text.replace(/\s/g, "").toLowerCase();
                setEmail(sanitized);
              }}
            />
          </View>
          <ThemedButton style={styles.button} title="Continue" />
          <ThemedText style={{ fontWeight: "200" }}>
            By clicking continue, you agree to our
          </ThemedText>
          <ThemedText style={{ fontWeight: "400" }}>
            Terms of Service and Privacy Policy
          </ThemedText>
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
