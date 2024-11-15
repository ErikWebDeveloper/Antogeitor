import { Alert } from "react-native";

export function AlertBox({ title = "", text = "", buttons = [] }) {
  return Alert.alert(title, text, buttons);
}
