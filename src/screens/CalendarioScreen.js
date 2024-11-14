import React, { useState, useCallback, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";
import * as Lang from "../lang/CalendarLang"; // Configurar español

export default function CalendarioScreen({ navigation }) {
  const [markedDates, setMarkedDates] = useState({});
  const { theme, themeCalendar } = useTheme();

  const handleDayPress = (day) => {
    navigation.navigate("Registros", { date: day.dateString });
  };

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

  const obtenerTodoAsyncStorage = async () => {
    try {
      //await AsyncStorage.clear();
      // Obtener todas las claves almacenadas en AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();

      // Convertir las claves en el formato adecuado para markedDates
      const datesWithRecords = allKeys.reduce((acc, date) => {
        acc[date] = { marked: true };
        return acc;
      }, {});

      setMarkedDates(datesWithRecords);
    } catch (error) {
      console.error("Error al obtener todos los datos de AsyncStorage:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerTodoAsyncStorage();
      logAllAsyncStorage();
    }, [])
  );

  return (
    <View
      style={{ flex: 1 /*justifyContent: "center", alignItems: "center"*/ }}
    >
      <Calendar
        theme={themeCalendar}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        firstDay={1}
        locale={"es"}
      />
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Productos");
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
            Añadir productos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
