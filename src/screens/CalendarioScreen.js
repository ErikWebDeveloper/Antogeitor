import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";
import { useSQLiteContext } from "expo-sqlite";
import { getAll as getFechas } from "../db/models/fechasModel";
import { insert as insertComida } from "../db/models/comidasModel";
import * as Lang from "../lang/CalendarLang"; // Configurar español

export default function CalendarioScreen({ navigation }) {
  const db = useSQLiteContext();
  const [markedDates, setMarkedDates] = useState({});
  const { theme, themeCalendar, colorScheme } = useTheme();
  const [key, setKey] = useState(0);
  const [migrate, setMigrate] = useState(false);

  const logAllAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys(); // Obtener todas las claves
      const items = await AsyncStorage.multiGet(keys); // Obtener los valores de esas claves

      console.log("AsyncStorage completo:");
      items.forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
    } catch (error) {
      console.error("Error al acceder a AsyncStorage:", error);
    }
  };

  const obtenerFechasConDatos = async () => {
    try {
      let { rows, success } = await getFechas(db);

      if (!success) return null;

      const newMarkedDates = rows.reduce((acc, item) => {
        acc[item.fecha] = { marked: true };
        return acc;
      }, {});

      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error("Error al obtener todos los datos de AsyncStorage:", error);
    }
  };

  // Cargar datos al iniciar
  useFocusEffect(
    useCallback(() => {
      obtenerFechasConDatos();
      //logAllAsyncStorage();
    }, [])
  );

  // Forzar renderización del calendario en cambios de tema
  useFocusEffect(
    useCallback(() => {
      setKey((prevVal) => prevVal + 1);
    }, [colorScheme])
  );

  const migrateToSQLite = async () => {
    try {
      // Obtener datos
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length === 0) return; // Si está vacío, salimos de la función

      // Obtener todos los items de AsyncStorage
      const items = await AsyncStorage.multiGet(keys);

      for (const [key, value] of items) {
        // Parsear el valor a JSON
        const valuesJSON = JSON.parse(value);

        // Recorrer cada registro del día
        for (const row of valuesJSON) {
          // Valores a guardar
          const dataForDb = {
            antojo: row.antojo,
            hora: row.hora,
            etiqueta: row.etiqueta,
            duracion: row.duracion,
            intensidad: row.intensidad,
            comida: row.comida,
            calorias: row.calorias === undefined ? "0" : row.calorias,
          };

          // Llamar a la función para insertar en SQLite
          await insertComida(db, key, dataForDb);
        }
      }

      // Borrar AsyncStorage
      await AsyncStorage.clear();
      setMigrate(false);
    } catch (error) {
      console.error("Error verificando AsyncStorage:", error);
      return false; // En caso de error, asumimos que la migración falló
    }
  };

  const needMigrate = async () => {
    // Verificar AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length === 0) return;

    setMigrate(true);
  };

  // Hacer migración de datos si es necesario
  useFocusEffect(
    useCallback(() => {
      needMigrate();
    }, [])
  );

  const handleDayPress = (day) => {
    navigation.navigate("Registros", { date: day.dateString });
  };

  return (
    <View
      style={{ flex: 1 /*justifyContent: "center", alignItems: "center"*/ }}
    >
      <Calendar
        key={key}
        theme={themeCalendar}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        firstDay={1}
        locale={"es"}
      />

      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Alimentos");
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              borderRadius: 50,
              backgroundColor: "#338dff",
              textAlign: "center",
              padding: 10,
              marginVertical: 50,
              width: "80%",
              marginHorizontal: "auto",
            }}
          >
            Añadir alimentos
          </Text>
        </TouchableOpacity>
      </View>

      {migrate && (
        <View>
          <TouchableOpacity
            onPress={() => {
              migrateToSQLite();
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 14,
                borderRadius: 50,
                backgroundColor: "#e16666",
                textAlign: "center",
                padding: 10,
                marginVertical: 50,
                width: "80%",
                marginHorizontal: "auto",
              }}
            >
              Migrar datos
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
