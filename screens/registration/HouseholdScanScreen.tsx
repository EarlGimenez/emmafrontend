"use client"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const { width } = Dimensions.get("window")

const HouseholdScanScreen = ({ navigation }: any) => {
  const handleScan = () => {
    // Log scan action
    console.log("QR Code scanned - joining household")

    // Simulate QR code scan - in real app this would use camera
    navigation.navigate("HouseholdInfo", { householdName: "Smith Family Household" })
  }

  const handleSkip = () => {
    // Log skip action
    console.log("Household scan skipped - proceeding to location details")

    navigation.navigate("LocationDetails")
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>←</Text>
          <Text style={commonStyles.backButtonText}>Household Information</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Household Information</Text>

          <View style={styles.contentContainer}>
            <Text style={styles.instructionText}>Scan a household QR code to join</Text>

            <TouchableOpacity style={styles.scannerContainer} onPress={handleScan}>
              <View style={styles.scannerBox}>
                <View style={styles.scannerFrame}>
                  <Text style={styles.scannerIcon}>📷</Text>
                  <Text style={styles.scannerText}>Tap to scan QR code</Text>
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.noteText}>Note: A household QR code can be generated from parent/guardian account</Text>
          </View>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={commonStyles.buttonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  instructionText: {
    fontSize: 18,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 40,
  },
  scannerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  scannerBox: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    alignItems: "center",
  },
  scannerIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  scannerText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
  skipButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    maxHeight: 40,
    justifyContent: "center",
  },
})

export default HouseholdScanScreen
