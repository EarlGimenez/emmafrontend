"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 56
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12
const SCROLL_BOTTOM_SPACING = 140

const OTPScreen = ({ navigation, route }: any) => {
  const { parentData } = route.params
  const [otpCode, setOtpCode] = useState("")

  const handleConfirm = () => {
    // Verify OTP with backend here
    navigation.navigate("VerificationSuccess", { parentData })
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.scroll, { marginTop: HEADER_OFFSET }]}
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
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
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={commonStyles.button} onPress={handleConfirm}>
          <Text style={commonStyles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Registration" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scroll: { flex: 1 },
  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    elevation: 4,
  },
  messageText: { fontSize: 14, color: "#333", textAlign: "center", marginBottom: 24, lineHeight: 20 },
  otpInput: { fontSize: 24, fontWeight: "bold", letterSpacing: 5 },
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default OTPScreen
