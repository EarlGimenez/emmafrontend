"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const FinalRemindersScreen = ({ navigation }: any) => {
  const [consentSharing, setConsentSharing] = useState(false)
  const [consentAlerts, setConsentAlerts] = useState(false)

  const handleCompleteRegistration = () => {
    if (consentSharing && consentAlerts) {
      const finalRegistrationData = {
        consentToSharing: consentSharing,
        consentToAlerts: consentAlerts,
        registrationCompleted: true,
        completionTimestamp: new Date().toISOString(),
      }

      console.log("=== REGISTRATION COMPLETED ===")
      console.log("Final registration data:", finalRegistrationData)
      console.log("User has completed the full registration process")
      console.log("================================")

      Alert.alert(
        "Registration Complete",
        "Thank you for completing your registration with E.M.M.A. You will now be redirected to the login screen.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
      )
    } else {
      console.log("Registration incomplete - missing consents:", {
        consentSharing,
        consentAlerts,
      })
    }
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={commonStyles.title}>Final Reminders</Text>

            <View style={styles.contentContainer}>
              <Text style={styles.thankYouText}>
                Thank you for registering with E.M.M.A (Evacuation Management and Monitoring Assistant).
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Information Shared</Text>
                <Text style={styles.sectionText}>
                  The information you provided will be used to ensure your safety during emergency situations and to
                  provide you with relevant evacuation guidance.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Consent to Sharing with Agencies</Text>
                <Text style={styles.sectionText}>
                  Your information may be shared with relevant government agencies and emergency responders during
                  disaster situations to ensure your safety and provide appropriate assistance.
                </Text>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setConsentSharing(!consentSharing)}>
                  <View style={[styles.checkbox, consentSharing && styles.checkboxChecked]} />
                  <Text style={styles.checkboxText}>
                    I consent to sharing my information with relevant agencies during emergencies
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Consent to Receiving Alerts and Notifications</Text>
                <Text style={styles.sectionText}>
                  You will receive important alerts, notifications, and updates about emergency situations, evacuation
                  procedures, and safety information.
                </Text>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setConsentAlerts(!consentAlerts)}>
                  <View style={[styles.checkbox, consentAlerts && styles.checkboxChecked]} />
                  <Text style={styles.checkboxText}>I consent to receiving emergency alerts and notifications</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.submitMessage}>
                By clicking "Complete Registration", you acknowledge that you have read and understood all the
                information provided and consent to the terms outlined above.
              </Text>
            </View>
          </ScrollView>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity
              style={[commonStyles.button, (!consentSharing || !consentAlerts) && styles.disabledButton]}
              onPress={handleCompleteRegistration}
              disabled={!consentSharing || !consentAlerts}
            >
              <Text style={commonStyles.buttonText}>Complete Registration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  thankYouText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    borderRadius: 4,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    lineHeight: 18,
  },
  submitMessage: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
})

export default FinalRemindersScreen
