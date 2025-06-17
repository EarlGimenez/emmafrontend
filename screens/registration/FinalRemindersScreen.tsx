"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

const FinalRemindersScreen = ({ navigation, route }: any) => {
  const [consentSharing, setConsentSharing] = useState(false);
  const [consentAlerts, setConsentAlerts] = useState(false);
  const [loading, setLoading] = useState(false);

  // Destructure userData and userToken from route.params
  // Provide default empty object to avoid errors if params are undefined
  const { userData, userToken } = route.params || {};

  // This useEffect is CRUCIAL. It ensures the token received from BasicInfoScreen
  // (after a successful /register call) is immediately stored in AsyncStorage
  // so that the 'fetcher' utility can pick it up for the subsequent completeRegistration call.
  useEffect(() => {
    const setAuthToken = async () => {
      if (userToken) {
        console.log("FinalRemindersScreen: Storing userToken:", userToken);
        await AsyncStorage.setItem("userToken", userToken);
      } else {
        // This case indicates an issue in the previous navigation step
        console.warn("FinalRemindersScreen: userToken is missing from route.params!");
        // You might want to navigate back or show an error to the user
      }

      if (userData && userData.userId) {
          console.log("FinalRemindersScreen: Received userData.userId:", userData.userId);
      } else {
          console.warn("FinalRemindersScreen: userData or userData.userId is missing from route.params!");
      }
    };

    setAuthToken();
  }, [userToken, userData]); // Re-run if userToken or userData changes

  const handleCompleteRegistration = async () => {
    if (!consentSharing || !consentAlerts) {
      Alert.alert("Consent Required", "Please agree to both data sharing and alerts to complete registration.");
      return;
    }

    if (!userData || !userData.userId) {
      Alert.alert("Error", "User data is missing. Please restart the registration process.");
      console.error("Missing userData or userId in FinalRemindersScreen params.");
      return;
    }

    setLoading(true);
    try {
      const finalUserData = {
        ...userData,
        status: 'active',
        consents: {
          dataSharing: consentSharing,
          alerts: consentAlerts,
          timestamp: new Date().toISOString(),
        }
      };

      console.log("FinalRemindersScreen: Attempting to complete registration for userId:", userData.userId);
      console.log("FinalRemindersScreen: user token:", userToken);
      if (!userToken) {
        console.error("FinalRemindersScreen: userToken is missing! Cannot complete registration.");
        Alert.alert("Error", "User token is missing. Please restart the registration process.");
        return;
      }
      // The fetcher will automatically add the Authorization header because
      // the token was set in AsyncStorage by the useEffect above.
      const response = await fetcher(API_URLS.users.complete(userData.userId), {
        method: "POST",
        headers : { "Authorization": `Bearer ${userToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(finalUserData),
      });

      if (response.success) {
        Alert.alert(
          "Registration Complete",
          "Thank you for completing your registration with E.M.M.A. You will now be redirected to the login screen.",
          [
            {
              text: "OK",
              onPress: async () => {
                // IMPORTANT: Clear the token after successful registration if you want
                // the user to explicitly log in with their now active account.
                // If you want auto-login, you'd update AsyncStorage with the new user state.
                await AsyncStorage.removeItem("userToken");
                await AsyncStorage.removeItem("userData"); // Also clear any stored user data
                
                // Navigate back to the login screen
                navigation.popToTop(); // Clears navigation stack
                navigation.replace("Login");
              },
            },
          ]
        );
      } else {
        // This error will likely be caught by the fetcher and shown as an alert
        throw new Error(response.message || "Failed to complete registration.");
      }
    } catch (error: any) {
      console.error("FinalRemindersScreen: Error completing registration:", error.message);
      // Fetcher already handles the alert for API errors.
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
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
