import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { changeNames } from "@/api/user";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { getUserData } from "@/storage/authStorage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

const screenWidth = Dimensions.get("window").width;

const EditProfile: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const color = colorScheme === "dark" ? "white" : "black";
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfileImage] = useState<string | null>(null);
  const [coverPhoto, setCoverImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidUsername, setIsInvalidUsername] = useState(false);
  const [isExistUsername, setIsExistUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [canChange, setCanChange] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setName(userData.name || "");
          setUsername(userData.username || "");
          setProfileImage(userData.profilePhoto || null); // if you have it saved
          setCoverImage(userData.coverPhoto || null); // if you have it saved
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const validateInputs = async () => {
      const user = await getUserData();
      if (user.name !== name || user.username !== username) {
        setCanChange(true);
      } else {
        setCanChange(false);
      }

      setIsInvalidName(!/^[A-Za-z0-9 ]{1,20}$/.test(name));
      setIsInvalidUsername(!/^[a-z0-9]{5,20}$/.test(username));
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
        mediaTypes: "images",
        allowsEditing: true,
        aspect,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }

      if (result && result.assets && result.assets.length) {
        // if base64 privoided use or covert
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
    }
  };

  const handleContinue = async () => {
    Keyboard.dismiss();

    // Api call
    setIsLoading(true);
    try {
      const data = await changeNames(name, username);

      if (data.status) {
        Alert.alert("Success", data.message);
        router.back();
        return;
      }
      // router.push("/(tab)");
    } catch (error: any) {
      setIsError(true);
      error.status === 409 && setIsExistUsername(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
  };

  const handleRemoveProfile = () => {
    setProfileImage(null);
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
          <ThemedView>
            {coverPhoto ? (
              <>
                <Image
                  source={{ uri: coverPhoto }}
                  style={[
                    styles.coverPhoto,
                    { backgroundColor: theme.background },
                  ]}
                />
                <TouchableOpacity
                  style={styles.deleteIconCover}
                  onPress={handleRemoveCover}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </>
            ) : (
              <ThemedView
                style={[
                  styles.coverPlaceholder,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <ThemedText
                  style={[styles.addPhotoText, { color: theme.text }]}
                >
                  Add Cover Photo
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </TouchableOpacity>

        {/* Profile Image */}
        <ThemedView style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => pickImage(setProfileImage, [1, 1])}
            style={[
              styles.profileImageWrapper,
              { borderColor: theme.borderColor },
            ]}
          >
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.profilePhoto}
              />
            ) : (
              <ThemedView
                style={[
                  styles.profilePlaceholder,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <ThemedText
                  style={[styles.addPhotoText, { color: theme.text }]}
                >
                  Add Profile Photo
                </ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>
          {profilePhoto && (
            <TouchableOpacity
              style={styles.deleteIconProfile}
              onPress={handleRemoveProfile}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Inputs and Button */}
        <ThemedView style={styles.bottomContainer}>
          <ThemedText type="title">{name}</ThemedText>
          <ThemedText type="subtitle">{username && `@${username}`}</ThemedText>

          <ThemedText type="subtitle" style={styles.titleText}>
            Edit your profile
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
                setIsError(false);
                const sanitized = text
                  .replace(/^\s+/, "") // Remove leading spaces
                  .replace(/[^A-Za-z\s]/g, ""); // Remove all non-letter characters
                setName(sanitized);
              }}
            />
          </ThemedView>

          {/* Username Input */}
          <ThemedView
            style={[
              styles.inputContainer,
              { borderColor: isExistUsername ? "red" : color },
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
              (isInvalidUsername ||
                isInvalidName ||
                isLoading ||
                isError ||
                isExistUsername ||
                !canChange) && {
                opacity: 0.5,
              },
            ]}
            title={!isLoading && "Change names"}
            onPress={handleContinue}
            disabled={
              isInvalidUsername ||
              isInvalidName ||
              isLoading ||
              isError ||
              isExistUsername ||
              !canChange
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
  coverPhoto: {
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
    marginVertical: 30,
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
  deleteIconCover: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "gray",
    borderRadius: 12,
  },

  deleteIconProfile: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "gray",
    borderRadius: 12,
    zIndex: 2,
  },
});
