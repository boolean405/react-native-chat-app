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

import { changeNames, deletePhoto } from "@/api/user";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { getUserData } from "@/storage/authStorage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import pickImage from "@/utils/pickImage";

const screenWidth = Dimensions.get("window").width;

const EditProfile: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const color = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string | null>(
    null
  );
  const [coverPhotoBase64, setCoverPhotoBase64] = useState<string | null>(null);

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
          setProfilePhoto(userData.profilePhoto || null); // if you have it saved
          setCoverPhoto(userData.coverPhoto || null); // if you have it saved
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
    Alert.alert(
      "Delete Cover Photo",
      "Are you sure you want to delete cover photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // api here
            const data = await deletePhoto(coverPhoto, "coverPhoto");
            data.status && setCoverPhoto(null);
          },
        },
      ]
    );
  };

  const handleRemoveProfile = () => {
    Alert.alert(
      "Delete Profile Photo",
      "Are you sure you want to delete profile photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // api here
            const data = await deletePhoto(profilePhoto, "profilePhoto");
            data.status && setProfilePhoto(null);
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer]}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={[styles.container]}>
          {/* Cover Image */}
          <TouchableOpacity
            onPress={() =>
              !isLoading &&
              pickImage(
                setCoverPhoto,
                setCoverPhotoBase64,
                setIsError,
                setErrorMessage,
                [2, 1]
              )
            }
          >
            <ThemedView style={styles.coverPhotoContainer}>
              {coverPhoto ? (
                <ThemedView>
                  <Image
                    source={{ uri: coverPhoto }}
                    style={[styles.coverPhoto]}
                  />
                  <TouchableOpacity
                    style={styles.deleteIconCover}
                    onPress={handleRemoveCover}
                  >
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </ThemedView>
              ) : (
                <ThemedView
                  style={[
                    styles.coverPlaceholder,
                    { backgroundColor: color.secondary },
                  ]}
                >
                  <ThemedText type="small">Add Cover Photo</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          </TouchableOpacity>

          {/* Profile Image */}
          <TouchableOpacity
            onPress={() =>
              !isLoading &&
              pickImage(
                setProfilePhoto,
                setProfilePhotoBase64,
                setIsError,
                setErrorMessage
              )
            }
            style={[styles.profileImageWrapper]}
          >
            {profilePhoto ? (
              <>
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.profilePhoto}
                />
                <TouchableOpacity
                  style={styles.deleteIconProfile}
                  onPress={handleRemoveProfile}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </>
            ) : (
              <ThemedView
                style={[
                  styles.profilePlaceholder,
                  { backgroundColor: color.secondary },
                ]}
              >
                <ThemedText type="small">Add Profile Photo</ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>

          {/* Inputs and Button */}
          <ThemedView style={styles.bottomContainer}>
            <ThemedText type="title">{name}</ThemedText>
            <ThemedText type="subtitle">
              {username && `@${username}`}
            </ThemedText>

            <ThemedText type="subtitle" style={styles.nameText}>
              Edit your profile
            </ThemedText>

            {/* Name Input */}
            <ThemedView
              style={[
                styles.inputContainer,
                { borderColor: color.borderColor },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={24}
                style={{ color: color.icon }}
              />
              <TextInput
                style={[styles.textInput, { color: color.primary }]}
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
                { borderColor: isExistUsername ? "red" : color.borderColor },
              ]}
            >
              <Ionicons
                name="at-outline"
                size={24}
                style={{ color: color.icon }}
              />
              <TextInput
                style={[styles.textInput, { color: color.primary }]}
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
                  setIsExistUsername(false);
                  const sanitized = text
                    .replace(/[^a-z0-9]/g, "")
                    .toLowerCase();
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
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

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

  addPhotoText: {
    fontSize: 14,
  },
  bottomContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
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

  coverPhotoContainer: {
    width: screenWidth * 0.9,
    // height: 180,
    // borderRadius: 12,
    // marginBottom: 20,
  },
  coverPhoto: {
    // width: screenWidth * 0.9,
    height: 180,
    borderRadius: 15,
    // marginBottom: 20,
  },
  coverPlaceholder: {
    // width: screenWidth * 0.9,
    height: 180,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 20,
  },
  deleteIconCover: {
    position: "absolute",
    top: 10,
    right: 10,
    // backgroundColor: "gray",
    // borderRadius: 12,
  },

  deleteIconProfile: {
    position: "absolute",
    right: 45,
    bottom: 0,
    // backgroundColor: "gray",
    // borderRadius: 12,
    // zIndex: 2,
  },
  profileImageWrapper: {
    marginTop: -30,
    borderRadius: 60,
    alignSelf: "center",
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
    // borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    marginTop: 20,
  },
});
