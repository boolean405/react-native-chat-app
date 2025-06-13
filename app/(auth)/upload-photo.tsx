import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { uploadPhoto } from "@/services/api";
import { getUserData } from "@/stores/authStore";

const screenWidth = Dimensions.get("window").width;

export default function UploadPhoto() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserData();
        if (user) {
          setName(user.name);
          setUsername(user.username);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

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
    if (!setProfilePhoto && !coverPhoto) {
      router.replace("/(tab)");
      return;
    }

    // Api call
    setIsLoading(true);
    try {
      const data = await uploadPhoto(profilePhoto, coverPhoto);
      data.status && router.replace("/(tab)");
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error);
      Alert.alert("Upload Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    aspect?: [number, number]
  ) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length) {
        setImage(result.assets[0].uri);
      } else {
        console.warn("No image selected or result malformed:", result);
      }
    } catch (error: any) {
      setIsError(true);
      const message = error?.message || "Unknown error";
      console.error("Image Picker Error:", error);
      setErrorMessage(message);
      Alert.alert("Image Picker Error", message);
    }
  };

  return (
    <ThemedView style={[styles.container]}>
      {/* Cover Image */}
      <TouchableOpacity
        onPress={() => !isLoading && pickImage(setCoverPhoto, [2, 1])}
      >
        {coverPhoto ? (
          <Image source={{ uri: coverPhoto }} style={styles.coverPhoto} />
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
        onPress={() => !isLoading && pickImage(setProfilePhoto, [1, 1])}
        style={[styles.profileImageWrapper]}
      >
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
        ) : (
          <ThemedView
            style={[
              styles.profilePlaceholder,
              {
                backgroundColor: theme.secondary,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <ThemedText style={[styles.addPhotoText, { color: theme.text }]}>
              Add Profile Photo
            </ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>

      <ThemedText type="title" style={styles.nameText}>
        {name}
      </ThemedText>
      <ThemedText type="subtitle">{username && `@${username}`}</ThemedText>
      {isError && (
        <ThemedText style={{ color: "red", marginTop: 10 }}>
          {errorMessage}
        </ThemedText>
      )}

      <ThemedButton
        style={[styles.button, isLoading && { opacity: 0.5 }]}
        disabled={isLoading}
        title={!isLoading && "Continue"}
        onPress={handleContinue}
        isLoading={isLoading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  coverPhoto: {
    width: screenWidth * 0.9,
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  coverPlaceholder: {
    width: screenWidth * 0.9,
    height: 180,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageWrapper: {
    marginTop: -50,
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
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoText: {
    fontSize: 14,
  },
  nameText: {
    marginTop: 20,
  },
  button: {
    width: "80%",
    marginTop: 50,
  },
});
