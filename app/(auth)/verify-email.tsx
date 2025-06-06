import { useColorScheme } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { saveUserData } from "@/store/authStore";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black";
  const inputs = useRef<Array<TextInput | null>>([]);

  const { email, password } = useLocalSearchParams();

  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResend = () => {
    setResendTimer(60);
    setCanResend(false);
    // API logic here
  };

  const handleOnChange = (text: string, index: number) => {
    // Always clear error when input changes
    setIsError(false);

    if (/^\d$/.test(text) || text === "") {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
      const allFilled = newCode.every((digit) => digit !== "");
      if (allFilled) {
        const code = newCode.join("");

        // api code here
        setIsLoading(true);
        setTimeout(async () => {
          const dbCode = "111111";
          if (code !== dbCode) {
            setIsError(true);
            setErrorMessage("Incorrect or expired verification code");
            setIsLoading(false);
            return;
          }
          if (!password) {
            router.replace({
              pathname: "/(auth)/reset-password",
              params: { email },
            });
          } else {
            const accessToken = "123456";
            const newUser = { email, password, accessToken };
            await saveUserData(newUser, accessToken);
            router.replace("/(tabs)");
          }
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
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
          <ThemedText type="subtitle">Verify your email</ThemedText>
          <ThemedText style={styles.titleText}>
            Enter verify code, check also in Spam folder
          </ThemedText>

          <ThemedView style={styles.inputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  { color },
                  isError && styles.codeInputError,
                ]}
                editable={!isLoading}
                autoFocus={index === 0}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOnChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </ThemedView>
          {isError && (
            <ThemedText style={{ color: "red" }}>{errorMessage}</ThemedText>
          )}

          <ThemedView style={styles.resendContainer}>
            {canResend ? (
              <ThemedText onPress={handleResend}>Resend</ThemedText>
            ) : (
              <ThemedText style={{ opacity: 0.5 }}>
                Resend available in {resendTimer}s
              </ThemedText>
            )}
          </ThemedView>
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
  titleText: {
    marginTop: 60,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 40,
    height: 50,
    textAlign: "center",
    fontSize: 18,
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  codeInputError: {
    borderColor: "red",
  },
});
