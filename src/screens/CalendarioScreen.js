import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CalendarioScreen({ navigation }) {
  const [markedDates, setMarkedDates] = useState({});

  const handleDayPress = (day) => {
    navigation.navigate("Registros", { date: day.dateString });
  };

  const obtenerTodoAsyncStorage = async () => {
    try {
      //await AsyncStorage.clear();
      // Obtener todas las claves almacenadas en AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();

      // Convertir las claves en el formato adecuado para markedDates
      const datesWithRecords = allKeys.reduce((acc, date) => {
        acc[date] = { marked: true, dotColor: "blue" };
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
    }, [])
  );

  return (
    <View
      style={{ flex: 1 /*justifyContent: "center", alignItems: "center"*/ }}
    >
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        style={{ width: "100%" }}
        firstDay={1}
        locale={"es"}
      />
    </View>
  );
}
