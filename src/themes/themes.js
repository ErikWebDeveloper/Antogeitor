import { DefaultTheme } from "@react-navigation/native";

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
  },
};

export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: "#222",
    text: "#FFFFFF",
    card: "#000"
  },
};
