import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CalendarioScreen from "./src/screens/CalendarioScreen";
import RegistrosScreen from "./src/screens/RegistrosScreen";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calendario">
        <Stack.Screen name="Calendario" component={CalendarioScreen} />
        <Stack.Screen name="Registros" component={RegistrosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
