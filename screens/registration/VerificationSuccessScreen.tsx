"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"

const SHEET_RADIUS = 20

const VerificationSuccessScreen = ({ navigation, route }: any) => {
  const { parentData } = route.params

  return (
    <View style={styles.container}>
      <View style={styles.sheetCenter}>
        <Text style={styles.checkMark}>✓</Text>
        <Text style={styles.title}>Verification Successful</Text>
        <Text style={styles.message}>
          Parent/Guardian profile has been verified.
          {"\n\n"}
          You can now proceed to fill out the required information for the child you will register.
        </Text>

        <TouchableOpacity
          style={[commonStyles.button, { alignSelf: "stretch", marginTop: 6 }]}
          onPress={() => navigation.navigate("ChildInfo", { parentData })}
        >
          <Text style={commonStyles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", paddingHorizontal: 16 },
  sheetCenter: {
    backgroundColor: "#fff",
    borderRadius: SHEET_RADIUS,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    elevation: 4,
  },
  checkMark: { fontSize: 84, color: "#4CAF50", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700", color: colors.primary, marginBottom: 10, textAlign: "center" },
  message: { fontSize: 15, color: "#333", textAlign: "center", lineHeight: 22, marginBottom: 16 },
})

export default VerificationSuccessScreen
