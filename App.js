import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import CalendarioScreen from "./src/screens/CalendarioScreen";
import RegistrosScreen from "./src/screens/RegistrosScreen";

import { lightTheme, darkTheme } from "./src/themes/themes";
import { ThemeProvider } from "./src/contexts/ThemeContext";

const Stack = createStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    const backgroundColor = colorScheme === "dark" ? "#000000" : "#FFFFFF";
    const barStyle = colorScheme === "dark" ? "light" : "dark";

    NavigationBar.setBackgroundColorAsync(backgroundColor);
    NavigationBar.setButtonStyleAsync(barStyle);
  }, [colorScheme]);

  return (
    <ThemeProvider>
      <NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName="Calendario">
          <Stack.Screen name="Calendario" component={CalendarioScreen} />
          <Stack.Screen name="Registros" component={RegistrosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"} 
        backgroundColor={colorScheme === "dark" ? "#000000" : "#FFFFFF"}
      />
    </ThemeProvider>
  );
}
