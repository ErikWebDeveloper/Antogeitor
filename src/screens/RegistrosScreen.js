import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { formatearFecha } from "../utils/date";
import { useTheme } from "../contexts/ThemeContext";

import { ModalSlideBottom } from "../components/Modals";
import { ButtonRound } from "../components/Buttons";

import { useSQLiteContext } from "expo-sqlite";
import {
  getAllByFecha,
  insert,
  updateById,
  deleteById,
} from "../db/models/comidasModel";
import {
  get as getFecha,
  removeById as deleteByIdFecha,
} from "../db/models/fechasModel";
import { get as getProductos } from "../db/models/productosModel";

const opcionesComida = {
  comidas: [
    { label: "🥞 Desayuno", value: "🥞 Desayuno" },
    { label: "🍴 Almuerzo", value: "🍴 Almuerzo" },
    { label: "🍏 Merienda", value: "🍏 Merienda" },
    { label: "🍽️ Cena", value: "🍽️ Cena" },
    { label: "🍿 Snack", value: "🍿 Snack" },
  ],
  antojos: [
    { label: "🍰 Pastel", value: "🍰 Pastel" },
    { label: "🍪 Galleta", value: "🍪 Galleta" },
    { label: "🍫 Chocolate", value: "🍫 Chocolate" },
    { label: "🍦 Helado", value: "🍦 Helado" },
    { label: "🍩 Dona", value: "🍩 Dona" },
    { label: "🍟 Papas fritas", value: "🍟 Papas fritas" },
    { label: "🍕 Pizza", value: "🍕 Pizza" },
    { label: "🌮 Taco", value: "🌮 Taco" },
    { label: "🍿 Palomitas", value: "🍿 Palomitas" },
    { label: "🌭 Hot dog", value: "🌭 Hot dog" },
    { label: "🥜 Nueces", value: "🥜 Nueces" },
    { label: "🥨 Pretzel", value: "🥨 Pretzel" },
    { label: "🍭 Chupetín", value: "🍭 Chupetín" },
  ],
};

export default function RegistrosScreen({ route }) {
  const { theme } = useTheme();
  const { date, dateId } = route.params;
  const db = useSQLiteContext();
  const [registros, setRegistros] = useState([]);
  const [products, setProducts] = useState([]);

  const [antojo, setAntojo] = useState(false);
  const [hora, setHora] = useState(null);
  const [duracion, setDuracion] = useState("");
  const [intensidad, setIntensidad] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [comida, setComida] = useState("");
  const [calorias, setCalorias] = useState("");
  const [totalCalorias, setTotalCalorias] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleRegistro, setModalVisibleRegistro] = useState(false);
  const [modalVisibleAlimentos, setModalVisibleAlimentos] = useState(false);

  // Obtener la lista de productos
  const getProducts = async () => {
    let products = await getProductos(db);
    setProducts(products);
    console.log(products);
  };

  // Cargar productos al iniciar
  useEffect(() => {
    getProducts();
  }, []);

  const limpiarRegistroVacio = async () => {
    try {
      // Obtener la fecha en la base de datos
      let { row, success } = await getFecha(db, date);
      if (!success)
        return Alert.alert(
          "⚠️ Error",
          "Error al obtener el indentificativo de la fecha del registro."
        );

      // Borrar fecha si no hay registros relacionados
      if (row !== null) await deleteByIdFecha(db, row?.id);
    } catch (error) {
      Alert.alert("⚠️ Error", `Error al limpiar el registro: ${error}`);
    }
  };

  const ordenarRegistros = (registrosDesordenados) => {
    let result = registrosDesordenados.sort((a, b) => {
      const [horaA, minutoA] = a.hora.split(":").map(Number);
      const [horaB, minutoB] = b.hora.split(":").map(Number);

      const tiempoA = horaA * 60 + minutoA;
      const tiempoB = horaB * 60 + minutoB;

      return tiempoA - tiempoB;
    });

    return result;
  };

  const cargarRegistros = async () => {
    try {
      // Obtener todos los datos
      let result = await getAllByFecha(db, date);

      if (!result.success)
        return Alert.alert("⚠️ Error", "Error al obtener los datos.");

      // Limpiar fecha si no tiene regitro
      if (result.rows.length === 0) await limpiarRegistroVacio();

      // Recuperar la informacion de registros
      if (result.rows) {
        let registrosOrdenados = ordenarRegistros(result.rows);
        setRegistros(registrosOrdenados);
        return result.rows;
      }
    } catch (error) {
      Alert.alert("⚠️ Error", `Error al cargar los registros ${error}`);
    }
  };

  const contabilizarTotalCalorias = async () => {
    try {
      let result = await getAllByFecha(db, date);
      if (!result.success)
        return Alert.alert("⚠️ Error", "Error al obtener los datos.");
      if (result.rows) {
        // Recorrer los registros y sumar las calorias
        const totalCalorias = result.rows
          .map((registro) => {
            const calorias = parseInt(registro.calorias, 10); // Intenta convertir a número
            return isNaN(calorias) ? 0 : calorias; // Si no es un número, devuelve 0
          })
          .reduce((total, calorias) => total + calorias, 0); // Suma todas las calorías

        setTotalCalorias(totalCalorias);
      }
    } catch (error) {
      Alert.alert("⚠️ Error", `Error al cargar los registros: ${error}`);
    }
  };

  const handleSwitchAntojo = (value) => {
    setAntojo(value);
    setEtiqueta("");

    // Si el switch antojo esta desactivado, ocultar intensidad y duracion
    // Si el switch antojo esta activado, ocultar comida
    if (!value) {
      setIntensidad("0");
      setDuracion("0");
      setComida("");
    } else {
      setIntensidad("");
      setDuracion("");
      setComida("0");
      setCalorias("");
    }
  };

  const initialState = () => {
    setSelectedRegistro(null);
    setAntojo("");
    setHora(null);
    setEtiqueta("");
    setDuracion("");
    setIntensidad("");
    setComida("");
    setCalorias("");
    handleSwitchAntojo(false);
    setModalVisible(false);
    setModalVisibleRegistro(false);
  };

  const resetApp = async () => {
    await cargarRegistros();
    await contabilizarTotalCalorias();
    initialState();
  };

  useEffect(() => {
    resetApp();
  }, []);

  const agregarRegistro = async () => {
    if (hora && etiqueta && comida && duracion && intensidad) {
      const horaMin = hora.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      let nuevosRegistros = [...registros];

      // Valores a gurdar
      let values = {
        antojo,
        hora: horaMin,
        etiqueta,
        duracion,
        intensidad,
        comida,
        calorias,
      };

      // Si estamos editando un registro
      if (selectedRegistro) {
        // Obtener id del registro
        const index = registros.findIndex(
          (registro) => registro === selectedRegistro
        );
        let id = nuevosRegistros[index].id;

        // Actualizar registro
        let result = await updateById(db, id, values);

        if (!result.success)
          return Alert.alert("⚠️ Error", `Error al actualizar`);
        // Si es una nueva insercion
      } else {
        // Insertar un nuevo registro
        let result = await insert(db, date, values);

        if (!result.success)
          return Alert.alert("⚠️ Error", "Error al insertar registro.");
      }

      // Resetar la app
      await resetApp();
    } else {
      Alert.alert(
        "⚠️ Nota importante",
        "Para almacenar un registro, ¡no puede haber ningún campo vacío!"
      );
    }
  };

  const eliminarRegistro = async () => {
    // Obtener id del registro y eliminar
    let { id } = selectedRegistro;
    let result = await deleteById(db, id);

    if (!result.success)
      return Alert.alert(
        "⚠️ Error",
        `Error al eliminar registro: ${result.error}`
      );

    await resetApp();
  };

  const openModalOptions = (registro) => {
    setSelectedRegistro(registro);
    setAntojo(registro.antojo === 0 ? false : true);
    setHora(new Date(`1970-01-01T${registro.hora}:00`));
    setEtiqueta(registro.etiqueta);
    setDuracion(registro.duracion);
    setIntensidad(registro.intensidad);
    setComida(registro.comida);
    setCalorias(registro.calorias);
    setModalVisible(true);
  };

  const openModalForm = () => {
    //setSelectedRegistro(null); // Limpiar el registro seleccionado si se está agregando uno nuevo
    setModalVisibleRegistro(true);
  };

  const openModalAlimentos = () => {
    setModalVisibleRegistro(false);
    setModalVisibleAlimentos(true);
  };

  const editarRegistro = () => {
    setModalVisible(false);
    setModalVisibleRegistro(true);
  };

  const importarAlimento = (alimento) => {
    setComida(alimento.comida);
    setCalorias(alimento.calorias);
    setModalVisibleRegistro(true);
    setModalVisibleAlimentos(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  return (
    <View style={[styles.container]}>
      {/* Header panel */}
      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.dateText, { flex: 1, color: theme.colors.text }]}>
          🗓️ {formatearFecha(date)}
        </Text>
        <Text
          style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.text }}
        >
          🔥 {totalCalorias} cal.
        </Text>
      </View>

      {/* Tabla de registro */}
      <View style={styles.tableContainer}>
        <FlatList
          data={registros}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.registroItem,
                { backgroundColor: item.antojo ? "#fec8c8" : "#c8defe" },
              ]}
              onPress={() => openModalOptions(item)}
            >
              {/* Header */}
              <View style={{ flexDirection: "row", opacity: 0.5, gap: 5 }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: "grey",
                  }}
                >
                  🕓 {item.hora}
                </Text>
                {item.antojo ? (
                  <>
                    <Text
                      style={{
                        fontSize: 12,
                        backgroundColor: "red",
                        paddingHorizontal: 5,
                        borderRadius: 50,
                        color: "white",
                      }}
                    >
                      ⭐️ {item.intensidad}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={{
                      fontSize: 12,
                      backgroundColor: "#5078ce",
                      paddingHorizontal: 5,
                      borderRadius: 50,
                      color: "white",
                    }}
                  >
                    {item.etiqueta}
                  </Text>
                )}
              </View>

              {/* Body */}
              <View>
                <Text>
                  {item.antojo ? `${item.etiqueta}` : `${item.comida}`}
                </Text>
              </View>

              {/* Footer */}
              <View
                style={{
                  flexDirection: "row",
                  opacity: 0.5,
                }}
              >
                <Text style={{ fontSize: 12, color: "grey" }}>
                  {!item.antojo
                    ? `🔥 ${
                        item.calorias === undefined
                          ? "-"
                          : `${item.calorias} cal.`
                      }`
                    : `⏳ ${item.duracion}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Boton para abrir formulario registro */}
      <View style={styles.butonsContainer}>
        <ButtonRound label="📌 Nuevo Registro" onPress={openModalForm} />
      </View>

      {/* Modal formulario registro */}
      <ModalSlideBottom
        modalVisible={modalVisibleRegistro}
        title={selectedRegistro ? "Editar registro" : "Nuevo registro"}
        onClose={initialState}
      >
        <View style={[styles.switchContainer]}>
          <Text style={{ marginRight: 10, color: "grey" }}>
            {!antojo ? "Antojo" : "🤤"}:
          </Text>
          <Switch value={antojo} onValueChange={handleSwitchAntojo} />
        </View>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.timeInput}
        >
          <Text style={{ color: theme.colors.text }}>
            {hora
              ? hora.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "🕓 Seleccionar Hora"}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={hora || new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <Picker
          selectedValue={etiqueta}
          onValueChange={(itemValue) => setEtiqueta(itemValue)}
          style={[
            styles.input,
            { color: etiqueta ? theme.colors.text : "gray" },
          ]}
        >
          {/* Renderizamos el elemento de selección inicial dependiendo del estado antojo */}
          <Picker.Item
            label={
              antojo ? "Seleccione un antojo" : "Seleccione una comida del día"
            }
            value=""
          />

          {/* Renderizamos las opciones de comida o antojo según el estado */}
          {antojo
            ? opcionesComida.antojos.map((antojoItem) => (
                <Picker.Item
                  key={antojoItem.value}
                  label={antojoItem.label}
                  value={antojoItem.value}
                />
              ))
            : opcionesComida.comidas.map((comida) => (
                <Picker.Item
                  key={comida.value}
                  label={comida.label}
                  value={comida.value}
                />
              ))}
        </Picker>

        {antojo && (
          <>
            {/* Picker para duración */}
            <Picker
              selectedValue={duracion}
              onValueChange={(itemValue) => setDuracion(itemValue)}
              style={[
                styles.input,
                { color: duracion ? theme.colors.text : "gray" },
              ]}
            >
              <Picker.Item label="Seleccione duración" value="" />
              <Picker.Item label="5 minutos" value="5" />
              <Picker.Item label="15 minutos" value="15" />
              <Picker.Item label="30 minutos" value="30" />
              <Picker.Item label="1 hora" value="60" />
              <Picker.Item label="2 horas" value="120" />
            </Picker>

            {/* Picker para intensidad */}
            <Picker
              selectedValue={intensidad}
              onValueChange={(itemValue) => setIntensidad(itemValue)}
              style={[
                styles.input,
                { color: intensidad ? theme.colors.text : "gray" },
              ]}
            >
              <Picker.Item label="Seleccione intensidad" value="" />
              <Picker.Item label="⭐" value="1" />
              <Picker.Item label="⭐⭐" value="2" />
              <Picker.Item label="⭐⭐⭐" value="3" />
              <Picker.Item label="⭐⭐⭐⭐" value="4" />
              <Picker.Item label="⭐⭐⭐⭐⭐" value="5" />
            </Picker>
          </>
        )}

        {!antojo && (
          <>
            <TouchableOpacity
              style={[styles.input, { marginBottom: 20 }]}
              onPress={openModalAlimentos}
            >
              <Text style={{ color: theme.colors.text, textAlign: "center" }}>
                📥 Agregar alimento
              </Text>
            </TouchableOpacity>

            <TextInput
              style={[
                styles.input,
                { marginBottom: 20, color: theme.colors.text },
              ]}
              onChangeText={(prevVal) => setComida(prevVal)}
              value={comida}
              placeholder="🥗 Comida..."
              placeholderTextColor={"grey"}
              keyboardType="default"
            />

            <TextInput
              style={[
                styles.input,
                { marginBottom: 20, color: theme.colors.text },
              ]}
              onChangeText={(prevVal) => setCalorias(prevVal)}
              value={calorias.toString()}
              placeholder="🔥 Calorías..."
              placeholderTextColor={"grey"}
              keyboardType="numeric"
            />
          </>
        )}

        <ButtonRound
          label={selectedRegistro ? "Guardar Cambios" : "Agregar Registro"}
          onPress={agregarRegistro}
        />
      </ModalSlideBottom>

      {/* Modal para editar o eliminar */}
      <ModalSlideBottom
        modalVisible={modalVisible}
        title="Seleccione una opción"
        onClose={initialState}
      >
        <View
          style={{
            gap: 15,
          }}
        >
          <ButtonRound label="✏️ Editar" onPress={editarRegistro} />
          <ButtonRound
            label="🗑️ Eliminar"
            styles={{ backgroundColor: "#f86c6c" }}
            onPress={() => {
              Alert.alert(
                "Eliminar registro",
                "¿Estás seguro de que deseas eliminar este registro?",
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Eliminar", onPress: eliminarRegistro },
                ]
              );
            }}
          />
        </View>
        {/*<Button title="Cancelar" onPress={() => setModalVisible(false)} />*/}
      </ModalSlideBottom>

      {/* Modal añadir alimentos */}
      <ModalSlideBottom
        modalVisible={modalVisibleAlimentos}
        title={"Selecciona tu alimento"}
        onClose={() => {
          setModalVisibleAlimentos(false), setModalVisibleRegistro(true);
        }}
      >
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.registroItem,
                { backgroundColor: item.antojo ? "#fec8c8" : "#c8defe" },
              ]}
              onPress={() => {
                importarAlimento(item);
              }}
            >
              <Text>{item.comida}</Text>
              <Text>{item.calorias}</Text>
            </TouchableOpacity>
          )}
        />
      </ModalSlideBottom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableContainer: {
    flexGrow: 1,
  },
  butonsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  registroItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    borderColor: "#666",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 5,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  picker: {
    fontSize: 18,
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 25,
  },
});
