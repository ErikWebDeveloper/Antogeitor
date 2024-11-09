// ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../themes/themes";
import {
  lightThemeCalendar,
  darkThemeCalendar,
} from "../themes/ClaendarThemes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(
    colorScheme === "dark" ? darkTheme : lightTheme
  );
  const [themeCalendar, setThemeCalendar] = useState(
    colorScheme === "dark" ? darkThemeCalendar : lightThemeCalendar
  );

  // Actualiza el tema automáticamente si cambia el esquema de color del sistema
  useEffect(() => {
    console.log("Updating color schema")
    const newTheme = colorScheme === "dark" ? darkTheme : lightTheme;
    const newThemeCalendar =
      colorScheme === "dark" ? darkThemeCalendar : lightThemeCalendar;
    setTheme(newTheme);
    setThemeCalendar(newThemeCalendar);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, themeCalendar, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto del tema
export const useTheme = () => useContext(ThemeContext);
