import { useState, useEffect } from "react";
import { TextInput, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { View, Text } from "react-native";

import { ModalSlideBottom } from "../components/Modals";
import { ButtonRound } from "../components/Buttons";
import { useSQLiteContext } from "expo-sqlite";
import { get, insert } from "../db/models/productosModel";

export default function ProductosScreen() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const [comida, setComida] = useState("");
  const [calorias, setCalorias] = useState("");
  const [modalForm, setModalForm] = useState(false);

  useEffect(() => {
    const getData = async () => {
      await get(db);
    };
    getData();
  }, []);

  const guardarDatos = async () => {
    await insert(db, { comida, calorias });
  };

  const resetForm = () => {
    setComida("");
    setCalorias("");
  };

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{ fontSize: 18, color: theme.colors.text, marginBottom: 10 }}
        >
          Mis productos
        </Text>
      </View>

      {/** Boton para abrir el modal de productos */}
      <ButtonRound
        label={"👉 Añadir producto"}
        style={styles.butonsContainer}
        onPress={() => {
          resetForm();
          setModalForm(true);
        }}
      />

      {/* Modal formulario de productos */}
      <ModalSlideBottom
        modalVisible={modalForm}
        title="Añadir producto"
        onClose={() => {
          setModalForm(false);
        }}
      >
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
      </ModalSlideBottom>
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
  butonsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
