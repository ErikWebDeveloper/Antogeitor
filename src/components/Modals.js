import { Modal, View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function ModalSlideBottom({
  children,
  title = "",
  onClose = () => {},
  modalVisible = false,
}) {
  const { theme } = useTheme();
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text style={{ fontSize: 22, color: theme.colors.text }}>
            {title}
          </Text>
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
    marginTop: 50,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    gap: 10,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
