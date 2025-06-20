import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import MessageItem from "@/components/MessageItem";
import { Message } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { searchUser } from "@/api/user";
import SearchItem from "@/components/SearchItem.";

export default function Search() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const { chatId, chatName } = useLocalSearchParams();

  const [keyword, setKeyword] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [results, setResults] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<TextInput>(null);

  // Filter types array
  const filterTypes: string[] = ["All", "Online", "Male", "Female", "Group"];

  useEffect(() => {
    // Step 2: Auto focus when screen mounts
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // slight delay helps avoid timing issues on some devices

    return () => clearTimeout(timeout);
  }, []);

  const debouncedKeyword = useDebounce(keyword, 400);

  // Api call
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedKeyword.trim()) {
        setResults([]);
        return;
      }

      if (selectedFilter === "All") {
        setIsLoading(true);
        try {
          const data = await searchUser(debouncedKeyword);
          setResults(data.result.users);
        } catch (error: any) {
          console.error("Search failed:", error.message);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (selectedFilter === "Online") {
        setIsLoading(true);
        try {
          const data = await searchUser(debouncedKeyword);
          setResults(data.result.users);
        } catch (error: any) {
          console.error("Search failed:", error.message);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
        return;
      }
    };

    fetchResults();
  }, [debouncedKeyword, selectedFilter]); // <== Add selectedFilter as dependency

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: color.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={[styles.header]}>
        <ThemedView style={[styles.inputContainer]}>
          <ThemedView
            style={[
              styles.inputTextContainer,
              { backgroundColor: color.secondary },
            ]}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                size={22}
                color={color.icon}
              />
            </TouchableOpacity>
            <TextInput
              ref={inputRef} // Step 3: Attach ref
              value={keyword}
              onChangeText={setKeyword}
              style={[styles.textInput, { color: color.text }]}
              placeholder="Search"
              placeholderTextColor="gray"
            />
            <TouchableOpacity onPress={() => console.log("camera")}>
              <Ionicons name="camera-outline" size={22} color={color.icon} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView
        style={[
          styles.filterContainer,
          { borderBottomColor: color.borderColor },
        ]}
      >
        {filterTypes.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              { borderColor: color.borderColor },
              selectedFilter === filter && {
                backgroundColor: color.primary,
              },
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <ThemedText
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === filter ? color.background : color.text,
                },
              ]}
            >
              {filter}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {isLoading && (
        <ThemedText style={{ textAlign: "center", marginVertical: 10 }}>
          Searching...
        </ThemedText>
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <SearchItem
            user={item}
            onPress={() =>
              router.push({
                pathname: "/(chat)",
                params: {
                  chatId: item._id,
                  chatName: item.name,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          keyword && !isLoading ? (
            <ThemedText style={{ textAlign: "center", marginVertical: 10 }}>
              No results found!
            </ThemedText>
          ) : null
        }
        style={styles.chatList}
      />
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    // padding: 15,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  chatList: { flex: 1 },

  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  inputTextContainer: {
    height: 40,
    width: "95%",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textInput: {
    flex: 1,
    paddingBottom: 0,
    paddingTop: 0,
    height: "100%",
    paddingLeft: 20,
  },
  filterContainer: {
    flexDirection: "row",
    // justifyContent: "space-evenly",
    // paddingVertical: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 0.2,
    paddingBottom: 10,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    // backgroundColor: "transparent",
    borderWidth: 0.5,
    marginHorizontal: 3,
  },
  filterText: {
    fontSize: 14,
  },
});
