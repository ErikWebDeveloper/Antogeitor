import { Modal, View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
export function ModalSlideBottom({
  children,
  title = "",
  onClose = () => {
    console.log("On close function()");
  },
  modalVisible = false,
}) {
  const { theme } = useTheme();
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      style={{ backgroundColor: "red" }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={{ fontSize: 22 }}>{title}</Text>
        {children}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
