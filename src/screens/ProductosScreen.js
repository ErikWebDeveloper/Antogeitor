import { Text } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function ProductosScreen() {
  const { theme } = useTheme();
  return (
    <>
      <Text>Productos</Text>
    </>
  );
}
