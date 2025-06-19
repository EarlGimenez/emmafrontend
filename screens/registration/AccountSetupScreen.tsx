"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native" // Import Alert
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "@/utils/fetcher" // Import your fetcher utility
import { API_URLS } from "@/config/api" // Import your API URLs

const AccountSetupScreen = ({ navigation, route }: any) => {
  // Use existing userData from previous registration steps, if any
  const existingUserData = route.params?.userData || {};

  const [email, setEmail] = useState(existingUserData.emailAddress || ""); // Pre-fill if email was gathered before
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleNext = async () => {
    // Basic frontend validation for password match
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Password and Confirm Password do not match.");
      return;
    }
    // Add more validation if needed (e.g., minimum password length, email format)

    setLoading(true); // Start loading
    try {
      // Data to send to the /register endpoint
      // Ensure all fields required by AuthController@register are included
      const registrationPayload = {
        fullName: existingUserData.fullName, // Assume fullName comes from BasicInfoScreen
        emailAddress: email,
        password: password,
        password_confirmation: confirmPassword, // Laravel's 'confirmed' rule
        dateOfBirth: existingUserData.dateOfBirth, // Assume from BasicInfoScreen
        contactNumber: existingUserData.contactNumber, // Assume from BasicInfoScreen
        // Add other fields needed by your AuthController@register if applicable
      };

      console.log("AccountSetupScreen: Registering user with payload:", registrationPayload);

      const response = await fetcher(API_URLS.auth.register, {
        method: "POST",
        body: JSON.stringify(registrationPayload),
      });

      console.log("AccountSetupScreen: Registration response:", response);

      if (response.success && response.user_id && response.access_token) {
        // If registration is successful, navigate to FinalRemindersScreen
        // Pass the new userId and the access_token
        const updatedUserData = {
          ...existingUserData, // Keep existing data
          userId: response.user_id, // Get the ID from the backend response
          account: {
            email: email,
            // Do NOT save password here in frontend state, only hash on backend
            timestamp: new Date().toISOString()
          }
        };
        
        console.log("AccountSetupScreen: Navigating to FinalReminders with userId:", response.user_id, "and token.");
        navigation.navigate("FinalReminders", { 
            userData: updatedUserData,
            userToken: response.access_token // Pass the token received from /register
        });
      } else {
        // If 'success' is false or essential data is missing, throw an error
        throw new Error(response.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("AccountSetupScreen: Registration API error:", error.message);
      // The fetcher already displays an Alert for API errors or network issues.
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Account Setup</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop: 20}}>

            <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Mobile Number</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Mobile Number"
                  value={existingUserData.contactNumber || ''} // Assume mobile number from BasicInfoScreen, make it read-only if it's not meant to be changed here
                  editable={false} // Prevent editing if already set in BasicInfo
                />
              </View>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Email Address</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Password</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Confirm Password</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </ScrollView>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity 
              style={commonStyles.button} 
              onPress={handleNext}
              disabled={loading} // Disable button while loading
            >
              <Text style={commonStyles.buttonText}>{loading ? "Registering..." : "Next"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

export default AccountSetupScreen;
