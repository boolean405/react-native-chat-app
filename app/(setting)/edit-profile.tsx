import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import pickImage from "@/utils/pickImage";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { getUserData } from "@/storage/authStorage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { changeNames, deletePhoto, uploadPhoto } from "@/api/user";
import { ThemedButton } from "@/components/ThemedButton";
import getImageMimeType from "@/utils/getImageMimeType";

const screenWidth = Dimensions.get("window").width;

const EditProfile: React.FC = () => {
  const colorScheme = useColorScheme();
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
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(false);
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
          setProfilePhoto(userData.profilePhoto || null);
          setCoverPhoto(userData.coverPhoto || null);
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
            try {
              // api here
              setIsCoverLoading(true);
              const data = await deletePhoto(coverPhoto, "coverPhoto");

              if (data.status) {
                setCoverPhoto(null);
                ToastAndroid.show("Cover photo deleted", ToastAndroid.SHORT);
              } else {
                ToastAndroid.show(
                  data.message || "Failed to delete cover photo",
                  ToastAndroid.SHORT
                );
              }
            } catch (error: any) {
              setIsError(true);
              setErrorMessage(error.message);
              ToastAndroid.show(
                error?.message || "Something went wrong",
                ToastAndroid.SHORT
              );
            } finally {
              setIsCoverLoading(false);
            }
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
            setIsProfileLoading(true);
            try {
              const data = await deletePhoto(profilePhoto, "profilePhoto");

              if (data.status) {
                setProfilePhoto(null);
                ToastAndroid.show("Profile photo deleted", ToastAndroid.SHORT);
              } else {
                ToastAndroid.show(
                  data.message || "Failed to delete profile photo",
                  ToastAndroid.SHORT
                );
              }
            } catch (error: any) {
              console.error("Delete profile photo error:", error);
              ToastAndroid.show(
                error?.message || "Something went wrong",
                ToastAndroid.SHORT
              );
            } finally {
              setIsProfileLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCoverUpload = async (uri: string, base64: string) => {
    Keyboard.dismiss();

    // Api call
    setIsCoverLoading(true);
    try {
      const coverImageType = getImageMimeType(uri);

      const coverPhotoUrl =
        uri && base64 ? `data:${coverImageType};base64,${base64}` : undefined;

      const data = await uploadPhoto(null, coverPhotoUrl);
      data.status &&
        ToastAndroid.show("Cover photo uploaded", ToastAndroid.SHORT);
      !data.status && Alert.alert("Upload Error", data.message);
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
      Alert.alert("Cover photo upload Error", error.message);
    } finally {
      setIsCoverLoading(false);
    }
  };

  const handleProfileUpload = async (uri: string, base64: string) => {
    Keyboard.dismiss();

    // Api call
    setIsProfileLoading(true);
    try {
      const profileImageType = getImageMimeType(uri);

      const profilePhotoUrl =
        uri && base64 ? `data:${profileImageType};base64,${base64}` : undefined;

      const data = await uploadPhoto(profilePhotoUrl, null);
      data.status &&
        ToastAndroid.show("Profile photo uploaded", ToastAndroid.SHORT);
      !data.status && Alert.alert("Profile photo upload Error", data.message);
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
      Alert.alert("Upload Error", error.message);
    } finally {
      setIsProfileLoading(false);
    }
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
                [2, 1],
                handleCoverUpload
              )
            }
          >
            <ThemedView style={styles.coverPhotoContainer}>
              {isCoverLoading && (
                <ActivityIndicator
                  size="small"
                  color={color.background}
                  style={[styles.coverUploadingIcon]}
                />
              )}
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
                setErrorMessage,
                [1, 1],
                handleProfileUpload
              )
            }
            style={[
              styles.profileImageWrapper,
              { borderColor: color.borderColor },
            ]}
          >
            {isProfileLoading && (
              <ActivityIndicator
                size="small"
                color={color.background}
                style={[styles.profileUploadingIcon]}
              />
            )}
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
                  console.log(profilePhoto);

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
    height: 180,
    overflow: "hidden",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
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
  },
  profileImageWrapper: {
    // position: "relative",
    width: 120,
    height: 120,
    marginTop: -30,
    borderRadius: 60,
    alignSelf: "center",
    borderWidth: 2,
    overflow: "hidden",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  profilePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    marginTop: 20,
  },
  profileUploadingIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 2,
  },
  coverUploadingIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 2,
  },
});
