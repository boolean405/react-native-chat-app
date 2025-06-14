import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultItalic" | "subtitle" | "param" | "link" | "paramItalic";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "defaultItalic" ? styles.defaultItalic : undefined,
        type === "title" ? styles.title : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "param" ? styles.param : undefined,
        type === "paramItalic" ? styles.paramItalic : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    // lineHeight: 24,
  },
  defaultItalic: {
    fontSize: 16,
    // lineHeight: 24,
    fontStyle: "italic",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  param: {
    fontSize: 14,
    // fontWeight: "500",
  },
  paramItalic: {
    fontSize: 14,
    fontStyle: "italic",
    // fontWeight: "500",
  },
  link: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0a7ea4",
  },
});
