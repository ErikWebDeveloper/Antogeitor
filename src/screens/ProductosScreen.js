import { useState, useEffect } from "react";
import { TextInput, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { View, Text, TouchableOpacity } from "react-native";

import { ModalSlideBottom } from "../components/Modals";
import { ButtonRound } from "../components/Buttons";
import { AlertBox } from "../components/Alerts";
import { Card } from "../components/Cards";

import { useSQLiteContext } from "expo-sqlite";
import { get, insert, deleteById } from "../db/models/productosModel";

export default function ProductosScreen() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState(null);
  const [comida, setComida] = useState("");
  const [calorias, setCalorias] = useState("");
  const [modalVisibleForm, setModalVisibleForm] = useState(false);
  const [modalVisibleCRUD, setModalVisibleCRUD] = useState(false);

  // Cargar productos al iniciar
  useEffect(() => {
    getProducts();
  }, []);

  // Obtener la lista de productos
  const getProducts = async () => {
    let products = await get(db);
    setProducts(products);
  };

  // Guardar producto
  const guardarDatos = async () => {
    let result = await insert(db, { comida, calorias });

    if (!result)
      return AlertBox({
        title: "⚠️ Error",
        text: "Error al insertar los datos",
        buttons: [{ text: "OK" }],
      });

    await getProducts(db);
    setModalVisibleForm(false);
    resetForm();
    return;
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setComida("");
    setCalorias("");
    setProductSelected(null);
  };

  // Editar producto
  const editarProducto = () => {
    setModalVisibleCRUD(false);
    setModalVisibleForm(true);
  };

  // Abrir modal CRUD
  const openModalCRUD = (product) => {
    console.log(product.calorias);
    setProductSelected(product);
    setComida(product.comida);
    setCalorias(`${product.calorias}`);
    setModalVisibleCRUD(true);
  };

  // Eliminar producto
  const eliminarProducto = async () => {
    if (!productSelected) return null;
    let response = await deleteById(db, productSelected.id);

    if (!response.success)
      return AlertBox({
        title: "Error",
        text: "Error al eliminar los datos",
        buttons: [{ text: "Aceptar" }],
      });

    setModalVisibleCRUD(false);
    setProductSelected(null);
    resetForm();
    await getProducts();
  };

  return (
    <View style={styles.container}>
      {/* Titulo de cabecera */}
      <Text
        style={{ fontSize: 18, color: theme.colors.text, marginBottom: 10 }}
      >
        Mis alimentos
      </Text>

      {/* Tabla de productos */}
      <View style={styles.tableContainer}>
        {products.map((product, index) => (
          <Card key={product.id}>
            <TouchableOpacity
              onPress={() => {
                openModalCRUD(product);
              }}
            >
              <Text style={{ color: theme.colors.text, fontSize: 14 }}>
                {product.comida}
              </Text>
              <Text
                style={{
                  color: theme.colors.text,
                  textAlign: "right",
                  fontSize: 12,
                  opacity: 0.5,
                }}
              >
                🔥 {product.calorias}
              </Text>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Boton para abrir el modal de productos */}
      <ButtonRound
        label={"👉 Añadir alimento"}
        style={styles.butonsContainer}
        onPress={() => {
          resetForm();
          setModalVisibleForm(true);
        }}
      />

      {/* Modal formulario de productos */}
      <ModalSlideBottom
        modalVisible={modalVisibleForm}
        title={productSelected ? "Editar alimento" : "Nuevo alimento"}
        onClose={() => {
          setModalVisibleForm(false);
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

      {/* Modal para editar o eliminar */}
      <ModalSlideBottom
        modalVisible={modalVisibleCRUD}
        title={"Seleccione una opción"}
        onClose={() => {
          setModalVisibleCRUD(false);
        }}
      >
        <ButtonRound label="✏️ Editar" onPress={editarProducto} />
        <ButtonRound
          label="🗑️ Eliminar"
          styles={{ backgroundColor: "#f86c6c" }}
          onPress={() => {
            AlertBox({
              title: "Eliminar registro",
              text: "¿Estás seguro de que deseas eliminar este registro?",
              buttons: [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: eliminarProducto },
              ],
            });
          }}
        />
      </ModalSlideBottom>
    </View>
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
  tableContainer: {
    gap: 5,
  },
});
