import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const AccountSuccessScreen = ({ navigation }: any) => {
  const handleNext = () => {
    console.log("Account setup completed successfully at:", new Date().toISOString())
    navigation.navigate("FinalReminders")
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <View style={commonStyles.whiteContainer}>
          <View style={styles.successContainer}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.successTitle}>Account Setup Successful</Text>
            <Text style={styles.successMessage}>
              Your account has been created successfully. You can now proceed to complete your registration.
            </Text>

            <View style={commonStyles.bottomButton}>
              <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
                <Text style={commonStyles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  checkMark: {
    fontSize: 80,
    color: "#4CAF50",
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
})

export default AccountSuccessScreen
