"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const BasicInfoScreen = ({ navigation, route }: any) => {
  const { accountType } = route.params
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emailAddress, setEmailAddress] = useState("")

  const handleNext = () => {
    const userData = {
      accountType,
      fullName,
      dateOfBirth,
      contactNumber,
      emailAddress,
      timestamp: new Date().toISOString(),
    }

    console.log("Basic personal information collected:", userData)

    // Navigate to appropriate verification screen based on account type
    switch (accountType) {
      case "pwd":
        console.log("Navigating to PWD verification")
        navigation.navigate("PWDVerification", { userData })
        break
      case "senior":
        console.log("Navigating to Senior verification")
        navigation.navigate("SeniorVerification", { userData })
        break
      case "parent":
      case "general":
        console.log("Navigating to General verification")
        navigation.navigate("GeneralVerification", { userData })
        break
      default:
        console.log("Default navigation to General verification")
        navigation.navigate("GeneralVerification", { userData })
    }
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>←</Text>
          <Text style={commonStyles.backButtonText}>Registration</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Basic Personal Information</Text>

          <View style={commonStyles.centeredContent}>
            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Full Name</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Date of Birth</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Date of Birth (MM/DD/YYYY)"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
            </View>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Contact Number</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Email Address</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Email Address"
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

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

export default BasicInfoScreen
