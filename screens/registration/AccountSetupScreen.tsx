"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const AccountSetupScreen = ({ navigation }: any) => {
  const [mobileNumber, setMobileNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleNext = () => {
    const accountData = {
      mobileNumber,
      email,
      passwordSet: password ? true : false,
      passwordsMatch: password === confirmPassword,
      timestamp: new Date().toISOString(),
    }

    console.log("Account setup data:", accountData)

    // Validate passwords match, etc.
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    navigation.navigate("AccountSuccess")
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Account Setup</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={commonStyles.title}>Account Setup</Text>

            <View style={commonStyles.centeredContent}>
              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Mobile Number</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Email</Text>
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

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
              <Text style={commonStyles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

export default AccountSetupScreen
