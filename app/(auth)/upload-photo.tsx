import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  useColorScheme,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { getUserData } from "@/stores/authStore";

const screenWidth = Dimensions.get("window").width;

export default function UploadPhoto() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

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

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        // api here
      } catch (error: any) {
      } finally {
        setIsLoading(false);
      }
    }, 1000);
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

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
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
