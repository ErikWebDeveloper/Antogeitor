import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const BarChartExample = () => {
  const MAX_DAYS = 7;
  useEffect(() => {
    obtenerCaloriasAsyncStorage({ lastDays: MAX_DAYS });
  }, []);

  const obtenerCaloriasAsyncStorage = async ({ lastDays }) => {
    try {
      // Obtener todas las claves almacenadas en AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();

      // Verificar que existan registros
      if (!allKeys) return console.log("No hay entradas");

      
    } catch (error) {
      console.error("Error al obtener todos los datos de AsyncStorage:", error);
    }
  };
  // Datos y configuración del gráfico
  const caloriaSemanal = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Color de las barras
    barPercentage: 0.5,
  };

  return (
    <View>
      <BarChart
        style={{ marginVertical: 8 }}
        data={caloriaSemanal}
        width={Dimensions.get("window").width - 16} // Ancho del gráfico
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
    </View>
  );
};
export default BarChartExample;
