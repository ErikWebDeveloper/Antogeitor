import { useState, useEffect } from "react";
import { TextInput, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { View, Text } from "react-native";
import { ButtonRound } from "../components/Buttons";
import { useSQLiteContext } from "expo-sqlite";
import { getData } from "../db/db";

export default function ProductosScreen() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const [comida, setComida] = useState();
  const [calorias, setCalorias] = useState();


  const guardarDatos = async () => {
    console.log(comida, calorias);
  };

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{ fontSize: 18, color: theme.colors.text, marginBottom: 10 }}
        >
          Nuevo Producto
        </Text>
        <TextInput
          style={[styles.input, { marginBottom: 20, color: theme.colors.text }]}
          onChangeText={(prevVal) => setComida(prevVal)}
          value={comida}
          placeholder="🥗 Comida..."
          placeholderTextColor={"grey"}
          keyboardType="default"
        />

        <TextInput
          style={[styles.input, { marginBottom: 20, color: theme.colors.text }]}
          onChangeText={(prevVal) => setCalorias(prevVal)}
          value={calorias}
          placeholder="🔥 Calorías..."
          placeholderTextColor={"grey"}
          keyboardType="numeric"
        />
        <ButtonRound label={"Guardar"} onPress={guardarDatos} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});
