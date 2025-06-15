import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Alert, Platform } from "react-native";

export default async function pickImage(
  setImage: React.Dispatch<React.SetStateAction<string | null>>,
  setImageBase64: React.Dispatch<React.SetStateAction<string | null>>,
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>,
  aspect?: [number, number]
) {
  try {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow media access!");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0].uri);

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
  } catch (error: any) {
    const message = error?.message || "Image picker error";
    console.error("Image Picker Error:", error);

    setIsError?.(true);
    setErrorMessage?.(message);
    Alert.alert("Image Picker Error", message);
  }
}
