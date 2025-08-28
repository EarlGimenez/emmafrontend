import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 56
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12
const SCROLL_BOTTOM_SPACING = 140

const AccountSuccessScreen = ({ navigation }: any) => {
  const handleNext = () => navigation.navigate("FinalReminders")

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.scroll, { marginTop: HEADER_OFFSET }]}
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.sheet, styles.center]}>
          <Text style={styles.checkMark}>✓</Text>
          <Text style={styles.successTitle}>Account Setup Successful</Text>
          <Text style={styles.successMessage}>
            Your account has been created successfully. You can now proceed to complete your registration.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
          <Text style={commonStyles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Registration" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    elevation: 4,
  },
  center: { alignItems: "center", justifyContent: "center" },
  checkMark: { fontSize: 80, color: "#4CAF50", marginBottom: 24 },
  successTitle: { fontSize: 22, fontWeight: "bold", color: colors.primary, marginBottom: 12, textAlign: "center" },
  successMessage: { fontSize: 16, color: "#333", textAlign: "center", lineHeight: 22 },
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default AccountSuccessScreen
