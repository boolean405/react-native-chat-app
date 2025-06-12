import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  useColorScheme,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "@/components/ThemedButton";
import { getUserData, saveUserData } from "@/stores/authStore";

const screenWidth = Dimensions.get("window").width;

const EditProfile: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const color = colorScheme === "dark" ? "white" : "black";
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidUsername, setIsInvalidUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setName(userData.name || "");
          setUsername(userData.username || "");
          setProfileImage(userData.profilePhoto || null); // if you have it saved
          setCoverImage(userData.coverImage || null); // if you have it saved
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const validateInputs = () => {
      setIsInvalidName(!/^[A-Za-z0-9 ]{1,30}$/.test(name));
      setIsInvalidUsername(!/^[a-z0-9]{6,20}$/.test(username));
    };
    validateInputs();
  }, [name, username]);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant media access to upload photos."
        );
      }
    };
    requestPermission();
  }, []);

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    aspect: [number, number]
  ) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
    }
  };

  const handleContinue = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    console.log(profilePhoto);

    setTimeout(async () => {
      try {
        const dbUsername = "boolean405";

        if (username === dbUsername) {
          setIsError(true);
          setErrorMessage("Username already exists!");
          return;
        }

        const updateUser = {
          name,
          username,
          profilePhoto,
          coverImage,
          accessToken: `1234/${username}/1234`,
        };

        await saveUserData(updateUser, updateUser.accessToken);
        router.push("/(tab)");
      } catch (error: any) {
        setIsError(true);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cover Image */}
        <TouchableOpacity onPress={() => pickImage(setCoverImage, [2, 1])}>
          {coverImage ? (
            <Image
              source={{ uri: coverImage }}
              style={[styles.coverImage, { backgroundColor: theme.background }]}
            />
          ) : (
            <ThemedView
              style={[
                styles.coverPlaceholder,
                { backgroundColor: theme.secondary },
              ]}
            >
              <ThemedText style={[styles.addPhotoText, { color: theme.text }]}>
                Add Cover Photo
              </ThemedText>
            </ThemedView>
          )}
        </TouchableOpacity>

        {/* Profile Image */}
        <TouchableOpacity
          onPress={() => pickImage(setProfileImage, [1, 1])}
          style={[
            styles.profileImageWrapper,
            { borderColor: theme.borderColor },
          ]}
        >
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <ThemedView
              style={[
                styles.profilePlaceholder,
                { backgroundColor: theme.secondary },
              ]}
            >
              <ThemedText style={[styles.addPhotoText, { color: theme.text }]}>
                Add Profile Photo
              </ThemedText>
            </ThemedView>
          )}
        </TouchableOpacity>

        {/* Inputs and Button */}
        <ThemedView style={styles.bottomContainer}>
          <ThemedText type="title">{name}</ThemedText>
          <ThemedText type="subtitle" style={styles.titleText}>
            {username && `@${username}`}
          </ThemedText>

          {/* Name Input */}
          <ThemedView style={[styles.inputContainer, { borderColor: color }]}>
            <Ionicons name="person-outline" size={24} style={{ color }} />
            <TextInput
              style={[styles.textInput, { color }]}
              placeholder="Name"
              autoComplete="name"
              placeholderTextColor="gray"
              value={name}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
              onBlur={() => setName(name.trim())}
              onChangeText={(text) => {
                const sanitized = text.replace(/[^A-Za-z ]/g, "");
                setName(sanitized);
              }}
            />
          </ThemedView>

          {/* Username Input */}
          <ThemedView
            style={[
              styles.inputContainer,
              { borderColor: isError ? "red" : color },
            ]}
          >
            <Ionicons name="at-outline" size={24} style={{ color }} />
            <TextInput
              style={[styles.textInput, { color }]}
              placeholder="Username"
              autoComplete="username-new"
              placeholderTextColor="gray"
              value={username}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              onSubmitEditing={() =>
                !isInvalidName &&
                !isInvalidUsername &&
                !isError &&
                handleContinue()
              }
              onChangeText={(text) => {
                setIsError(false);
                const sanitized = text.replace(/[^a-z0-9]/g, "").toLowerCase();
                setUsername(sanitized);
              }}
            />
          </ThemedView>

          {isError && (
            <ThemedText style={{ color: "red" }}>{errorMessage}</ThemedText>
          )}

          <ThemedButton
            style={[
              styles.button,
              (isInvalidUsername || isInvalidName || isLoading || isError) && {
                opacity: 0.5,
              },
            ]}
            title={!isLoading && "Continue"}
            onPress={handleContinue}
            disabled={
              isInvalidUsername || isInvalidName || isLoading || isError
            }
            isLoading={isLoading}
          />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 40,
    flexGrow: 1,
  },
  coverImage: {
    width: screenWidth,
    height: 180,
  },
  coverPlaceholder: {
    width: screenWidth,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageWrapper: {
    marginTop: -30,
    borderRadius: 60,
    borderWidth: 2,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoText: {
    fontSize: 14,
  },
  bottomContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  titleText: {
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    width: "80%",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    height: 50,
  },
  button: {
    width: "80%",
    marginTop: 10,
  },
});
