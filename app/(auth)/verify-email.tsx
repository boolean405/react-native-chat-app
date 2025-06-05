import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function VerifyEmailScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [isInvalidCode, setIsInvalidCode] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black";

  const inputs = useRef<Array<TextInput | null>>([]);

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

  const changeRoute = () => {
    setIsLoading(true);
    setTimeout(() => {
      // APi here
      // router.replace("/(auth)");
      setIsLoading(false);
    }, 1000);

    // for real api
    //    setIsLoading(true);
    // try {
    //   const response = await verifyCodeAPI(verificationCode);
    //   if (response.success) {
    //     router.replace("/(auth)");
    //   } else {
    //     setIsInvalidCode(true);
    //   }
    // } catch (error) {
    //   console.error("Verification failed", error);
    //   setIsInvalidCode(true);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleResend = () => {
    console.log("Code resent");
    setResendTimer(60);
    setCanResend(false);
    // Optional: trigger resend API logic here
  };

  const handleChange = (text: string, index: number) => {
    // Always clear error when input changes
    if (isInvalidCode) setIsInvalidCode(false);

    if (/^\d$/.test(text) || text === "") {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }

      const allFilled = newCode.every((digit) => digit !== "");
      if (allFilled) {
        const verificationCode = newCode.join("");
        console.log("Verification Code:", verificationCode);
        changeRoute();
      }
    }
  };

  const handleContinue = () => {
    if (!code.includes("")) {
      const verificationCode = code.join("");
      console.log("Verification Code:", verificationCode);
      changeRoute();
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  isInvalidCode && styles.codeInputError,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </ThemedView>

          <ThemedButton
            disabled={code.includes("") || isLoading}
            title={isLoading ? "Verifying" : "Continue"}
            style={[
              styles.button,
              (code.includes("") || isLoading) && { backgroundColor: "gray" },
            ]}
            onPress={handleContinue}
          />

          <ThemedView style={styles.resendContainer}>
            {canResend ? (
              <ThemedText onPress={handleResend}>Resend</ThemedText>
            ) : (
              <ThemedText style={{ color: "gray" }}>
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
    marginBottom: 20,
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
  button: {
    width: "80%",
    marginVertical: 20,
  },
  resendContainer: {
    alignItems: "center",
  },
  codeInputError: {
    borderColor: "red",
  },
});
