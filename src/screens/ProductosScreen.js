import { useEffect } from "react";
import { Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { initDB, getData } from "../db/db";

export default function ProductosScreen() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  console.log(db);

  useEffect(() => {
    const initDatabase = async () => {
      await initDB(db);
      await getData(db);
    };
    initDatabase();
  }, []);
  return (
    <>
      <Text>Productos</Text>
    </>
  );
}
