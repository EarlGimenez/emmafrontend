"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"

// Match your RegistrationHeader geometry exactly
const HEADER_HEIGHT = 140
const DIP_HEIGHT = 56
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP)
const SCROLL_BOTTOM_SPACING = 140

const AccountSetupScreen = ({ navigation, route }: any) => {
  const existingUserData = route.params?.userData || {}
  const [email, setEmail] = useState(existingUserData.emailAddress || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Password and Confirm Password do not match.")
      return
    }

    setLoading(true)
    try {
      const registrationPayload = {
        fullName: existingUserData.fullName,
        emailAddress: email,
        password,
        password_confirmation: confirmPassword,
        dateOfBirth: existingUserData.dateOfBirth,
        contactNumber: existingUserData.contactNumber,
      }

      console.log("AccountSetupScreen: Sending registration payload:", JSON.stringify(registrationPayload, null, 2))

      const response = await fetcher(API_URLS.auth.register, {
        method: "POST",
        body: JSON.stringify(registrationPayload),
      })

      console.log("AccountSetupScreen: Registration response:", JSON.stringify(response, null, 2))

      // Check different possible response structures
      const userId = response.user_id || response.data?.user_id || response.data?.id || response.id
      const accessToken = response.access_token || response.data?.access_token || response.token || response.data?.token

      if (userId && accessToken) {
        const updatedUserData = {
          ...existingUserData,
          userId: userId,
          account: { email, timestamp: new Date().toISOString() },
        }
        console.log("AccountSetupScreen: Navigating to FinalReminders with data:", JSON.stringify(updatedUserData, null, 2))
        navigation.navigate("FinalReminders", {
          userData: updatedUserData,
          userToken: accessToken,
        })
      } else if (response.success || response.status === "success") {
        // Registration successful but missing authentication data
        Alert.alert("Registration Complete", "Your account has been created. Please log in.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login")
          }
        ])
      } else {
        console.error("AccountSetupScreen: Registration response indicates failure:", response)
        Alert.alert("Registration Error", response.message || "Registration failed. Please try again.")
      }
    } catch (error: any) {
      console.error("AccountSetupScreen: Registration API error:", error.message)
      Alert.alert("Registration Error", error.message || "An unexpected error occurred during registration.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: HEADER_OFFSET, paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={commonStyles.title}>Account Setup</Text>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Mobile Number</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Mobile Number"
              value={existingUserData.contactNumber}
              editable={true}
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
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={commonStyles.button} onPress={handleNext} disabled={loading}>
          <Text style={commonStyles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Registration" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    elevation: 4,
  },
  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },
})

export default AccountSetupScreen
