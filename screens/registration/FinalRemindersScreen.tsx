"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"

const FinalRemindersScreen = ({ navigation, route }: any) => {
  const [consentSharing, setConsentSharing] = useState(false)
  const [consentAlerts, setConsentAlerts] = useState(false)
  const { userData } = route.params

const handleCompleteRegistration = async () => {
  if (consentSharing && consentAlerts) {
    try {
      const finalUserData = {
        ...userData,
        status: 'active', // Explicitly set status
        consents: {
          dataSharing: consentSharing,
          alerts: consentAlerts,
          timestamp: new Date().toISOString()
        }
      };

      const response = await fetcher(API_URLS.users.complete(userData.userId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalUserData)
      });

      if (response.success) {
        Alert.alert(
          "Registration Complete",
          "Thank you for completing your registration with E.M.M.A. You will now be redirected to the login screen.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ],
        );
      } else {
        console.log('Registration response:', response);
        throw new Error(response.message || 'Failed to complete registration');
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to complete registration. Please try again.");
      console.error('Registration error:', error);
    }
  }
};

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={commonStyles.title}>Final Reminders</Text>

            <View style={styles.contentContainer}>
              <Text style={styles.thankYouText}>
                Thank you for completing your registration! Before you proceed, we’d like to remind you of our Data Privacy Notice and ask for your consent on the following:
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionText}>
                  Your personal information will be used to provide efficient disaster response services. We will only share your data with authorized government agencies and disaster response teams. You can review our full Data Privacy Notice [here].
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Sharing Consent</Text>
                <Text style={styles.sectionText}>
                  To ensure coordinated disaster response, we may share your information with the following: Local Government Units (LGUs), Department of Social Welfare and Development (DSWD), and other relevant government agencies and disaster response teams.
                </Text>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setConsentSharing(!consentSharing)}>
                  <View style={[styles.checkbox, consentSharing && styles.checkboxChecked]} />
                  <Text style={styles.checkboxText}>
                    Yes, I consent to sharing my data with LGUs, DSWD, and other relevant agencies.
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alerts and Notifications</Text>
                <Text style={styles.sectionText}>
                  To keep you informed during emergencies, we would like to send you alerts and notifications via SMS, email, or in-app messages.
                </Text>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setConsentAlerts(!consentAlerts)}>
                  <View style={[styles.checkbox, consentAlerts && styles.checkboxChecked]} />
                  <Text style={styles.checkboxText}>Yes, I consent to receiving emergency alerts and notifications.</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.submitMessage}>
                By clicking "Complete Registration", you confirm that you have read and agreed to the above consents.
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
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 8,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    fontSize: 14,
    color: colors.primary,
    flex: 1,
  },
  submitMessage: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
})

export default FinalRemindersScreen
