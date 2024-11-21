import { View, StyleSheet } from "react-native";

export const Card = ({ children, style }) => {
  return <View style={[styles.cardContainer, {style}]}>{children}</View>;
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 112, 255, 0.2)",
    marginBottom: 15,
  },
});
