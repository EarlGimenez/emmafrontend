"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const OTPScreen = ({ navigation, route }: any) => {
  const { parentData } = route.params
  const [otpCode, setOtpCode] = useState("")

  const handleConfirm = () => {
    // Here you would verify the OTP with your backend
    navigation.navigate("VerificationSuccess", { parentData })
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← OTP Verification</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>OTP Verification</Text>

          <Text style={styles.messageText}>
            An OTP code has been sent to the parent/guardian mobile number associated with this profile.
            {"\n\n"}
            Please check your messages and type in the code to proceed.
          </Text>

          <TextInput
            style={[commonStyles.input, styles.otpInput]}
            placeholder="Enter OTP Code"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="numeric"
            maxLength={6}
            textAlign="center"
          />

          <TouchableOpacity style={commonStyles.button} onPress={handleConfirm}>
            <Text style={commonStyles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  messageText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 5,
  },
})

export default OTPScreen
