import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";
import { useSQLiteContext } from "expo-sqlite";
import { getAll as getFechas } from "../db/models/fechasModel";
import * as Lang from "../lang/CalendarLang"; // Configurar español

export default function CalendarioScreen({ navigation }) {
  const db = useSQLiteContext();
  const [markedDates, setMarkedDates] = useState({});
  const { theme, themeCalendar, colorScheme } = useTheme();
  const [key, setKey] = useState(0);

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
    </View>
  );
}
