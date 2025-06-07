import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface ListItem {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

interface Props {
  title: string;
  data: ListItem[];
  tintColor: string;
  textColor: string;
  separatorColor: string;
}

export const ListSection: React.FC<Props> = ({
  title,
  data,
  tintColor,
  textColor,
  separatorColor,
}) => {
  const renderItem = ({ item }: { item: ListItem }) => (
    <ThemedView style={styles.listItem}>
      <Ionicons name={item.iconName} size={24} color={tintColor} />
      <ThemedText style={[styles.listLabel, { color: textColor }]}>
        {item.label}
      </ThemedText>
    </ThemedView>
  );

  return (
    <>
      <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
        {title}
      </ThemedText>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
        style={styles.list}
        ItemSeparatorComponent={() => (
          <ThemedView
            style={[styles.separator, { backgroundColor: separatorColor }]}
          />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  list: {
    marginBottom: 25,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  listLabel: {
    marginLeft: 16,
    fontSize: 16,
  },
  separator: {
    height: 1,
    marginLeft: 40,
  },
});
