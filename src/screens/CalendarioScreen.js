import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";
import * as Lang from "../lang/CalendarLang"
/*// Configura el idioma en español
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};

// Establece el idioma predeterminado
LocaleConfig.defaultLocale = "es";*/

export default function CalendarioScreen({ navigation }) {
  const [markedDates, setMarkedDates] = useState({});
  const { theme, themeCalendar } = useTheme();

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
        acc[date] = { marked: true};
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
        theme={themeCalendar}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        firstDay={1}
        locale={"es"}
      />
    </View>
  );
}
