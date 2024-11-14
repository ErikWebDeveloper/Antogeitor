import { TouchableOpacity, Text } from "react-native";

export function ButtonRound({ label, onPress }) {
  return (
    <>
    <TouchableOpacity onPress={onPress}>
      <Text
        style={{
          color: "white",
          fontSize: 14,
          borderRadius: 50,
          backgroundColor: "#338dff",
          textAlign: "center",
          padding: 10,
          width: "80%",
          marginHorizontal: "auto",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
    </>
  );
}
