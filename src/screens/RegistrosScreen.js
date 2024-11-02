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
  const { date } = route.params;
  const [registros, setRegistros] = useState([]);

  const [antojo, setAntojo] = useState(false);
  const [hora, setHora] = useState(null);
  const [duracion, setDuracion] = useState("");
  const [intensidad, setIntensidad] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [comida, setComida] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleRegistro, setModalVisibleRegistro] = useState(false);

  useEffect(() => {
    limpiarRegistroVacio();
    cargarRegistros();
    handleSwitchAntojo(antojo);
  }, []);

  const limpiarRegistroVacio = async () => {
    try {
      let registro = await AsyncStorage.getItem(date);
      let registroJson = registro ? JSON.parse(registro) : null;
      // Si hay registro almacendo como item, pero esta vacio, lo eliminamos
      if (registroJson?.length === 0 && registroJson !== null) {
        await AsyncStorage.removeItem(date);
      }
    } catch (error) {
      console.error("Error al limpiar el registro:", error);
    }
  };

  const cargarRegistros = async () => {
    try {
      const registrosGuardados = await AsyncStorage.getItem(date);
      if (registrosGuardados) {
        setRegistros(JSON.parse(registrosGuardados));
      }
    } catch (error) {
      console.error("Error al cargar los registros:", error);
    }
  };

  const guardarRegistros = async (nuevosRegistros) => {
    try {
      await AsyncStorage.setItem(date, JSON.stringify(nuevosRegistros));
      await limpiarRegistroVacio();
    } catch (error) {
      console.error("Error al guardar los registros:", error);
    }
  };

  const agregarRegistro = () => {
    if (hora && etiqueta && duracion && intensidad && comida) {
      const horaMin = hora.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      let nuevosRegistros = [...registros];

      // Si estamos editando un registro, lo reemplazamos
      if (selectedRegistro) {
        const index = registros.findIndex(
          (registro) => registro === selectedRegistro
        );
        nuevosRegistros[index] = {
          antojo,
          hora: horaMin,
          etiqueta,
          duracion,
          intensidad,
          comida,
        };
      } else {
        nuevosRegistros.push({
          antojo,
          hora: horaMin,
          etiqueta,
          duracion,
          intensidad,
          comida,
        });
      }

      //nuevosRegistros.sort((a, b) => a.hora.localeCompare(b.hora));
      nuevosRegistros.sort((a, b) => {
        const [horaA, minutoA] = a.hora.split(":").map(Number);
        const [horaB, minutoB] = b.hora.split(":").map(Number);

        const tiempoA = horaA * 60 + minutoA;
        const tiempoB = horaB * 60 + minutoB;

        return tiempoA - tiempoB;
      });
      setRegistros(nuevosRegistros);
      guardarRegistros(nuevosRegistros);
      resetFormulario();
    } else {
      Alert.alert(
        "⚠️ Nota importante",
        "Para almacenar un registro, ¡no puede haber ningún campo vacío!"
      );
    }
  };

  const resetFormulario = () => {
    setAntojo(false);
    setHora(null);
    //Este estado lo pasa a manejar handleSwitchAntojo()
    //setEtiqueta("");
    //setDuracion("");
    //setIntensidad("");
    //setComida("");
    handleSwitchAntojo(false);
    setSelectedRegistro(null);
    setModalVisibleRegistro(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  const openModal = (registro) => {
    setSelectedRegistro(registro);
    setAntojo(registro.antojo);
    setHora(new Date(`1970-01-01T${registro.hora}:00`));
    setEtiqueta(registro.etiqueta);
    setDuracion(registro.duracion);
    setIntensidad(registro.intensidad);
    setComida(registro.comida);
    setModalVisible(true);
  };

  const editarRegistro = () => {
    setModalVisible(false);
    setModalVisibleRegistro(true);
  };

  const eliminarRegistro = () => {
    const nuevosRegistros = registros.filter((r) => r !== selectedRegistro);
    setRegistros(nuevosRegistros);
    guardarRegistros(nuevosRegistros);
    setModalVisible(false);
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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>🗓️ {formatearFecha(date)}</Text>

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
              onPress={() => openModal(item)}
            >
              <Text>🕓 {item.hora}</Text>
              {!item.antojo && (
                <>
                  <Text>{item.comida}</Text>
                </>
              )}
              <Text>{item.etiqueta}</Text>

              {item.antojo && (
                <>
                  <Text>⏳ {item.duracion}</Text>
                  <Text>⭐️ {item.intensidad}</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Boton para abrir formulario registro */}
      <View style={styles.butonsContainer}>
        <Button
          title="📌 Nuevo Registro"
          onPress={() => {
            setSelectedRegistro(null); // Limpiar el registro seleccionado si se está agregando uno nuevo
            setModalVisibleRegistro(true);
          }}
        />
      </View>

      {/* Modal formulario registro */}
      <Modal
        visible={modalVisibleRegistro}
        transparent={true}
        animationType="slide"
        onRequestClose={resetFormulario}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 22 }}>
              {selectedRegistro ? "Editar registro" : "Nuevo registro"}
            </Text>

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
              <Text>
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
              style={[styles.input, { color: etiqueta ? "black" : "gray" }]}
            >
              {/* Renderizamos el elemento de selección inicial dependiendo del estado antojo */}
              <Picker.Item
                label={
                  antojo ? "Seleccione un antojo" : "Seleccione una comida"
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
                  style={[styles.input, { color: etiqueta ? "black" : "gray" }]}
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
                  style={[styles.input, { color: etiqueta ? "black" : "gray" }]}
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
                <TextInput
                  style={[styles.input, { marginBottom: 20 }]}
                  onChangeText={(prevVal) => setComida(prevVal)}
                  value={comida}
                  placeholder="Comida..."
                  placeholderTextColor={"grey"}
                  keyboardType="default"
                />
              </>
            )}

            <Button
              title={selectedRegistro ? "Guardar Cambios" : "Agregar Registro"}
              onPress={agregarRegistro}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para editar o eliminar */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 22, marginBottom: 15 }}>
              Seleccione una opción
            </Text>
            <View
              style={{
                gap: 15,
              }}
            >
              <Button title="✏️ Editar" onPress={editarRegistro} />
              <Button
                title="🗑️ Eliminar"
                color="#f86c6c"
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
          </View>
        </View>
      </Modal>
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  registroItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderColor: "#666",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    paddingHorizontal: 15,
    paddingVertical: 15,
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