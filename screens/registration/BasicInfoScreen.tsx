"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"

const BasicInfoScreen = ({ navigation, route }: any) => {
  const { accountType } = route.params
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emailAddress, setEmailAddress] = useState("")

  const handleSkip = () => {
  const skipUserData = {
    accountType,
    fullName: "Test User",
    dateOfBirth: "01/01/2000",
    contactNumber: "1234567890",
    emailAddress: "test@example.com",
    userId: "SKIP_" + new Date().getTime(),
    timestamp: new Date().toISOString(),
  }

  switch (accountType) {
    case "pwd":
      navigation.navigate("PWDVerification", { userData: skipUserData });
      break;
    case "senior":
      navigation.navigate("SeniorVerification", { userData: skipUserData });
      break;
    case "parent":
    case "general":
      navigation.navigate("GeneralVerification", { userData: skipUserData });
      break;
    default:
      navigation.navigate("GeneralVerification", { userData: skipUserData });
  }
}

  const handleNext = async () => {
    const userData = {
      accountType,
      fullName,
      dateOfBirth,
      contactNumber,
      emailAddress,
      timestamp: new Date().toISOString(),
    }

    try {
      const response = await fetcher(API_URLS.users.temp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.success && response.userId) {
        // Pass userId and userData to next screen
        const userDataWithId = { ...userData, userId: response.userId };

        switch (accountType) {
          case "pwd":
            navigation.navigate("PWDVerification", { userData: userDataWithId });
            break;
          case "senior":
            navigation.navigate("SeniorVerification", { userData: userDataWithId });
            break;
          case "parent":
          case "general":
            navigation.navigate("GeneralVerification", { userData: userDataWithId });
            break;
          default:
            navigation.navigate("GeneralVerification", { userData: userDataWithId });
        }
      } else {
        alert("Failed to create user. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again." + error );
    }
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Registration</Text>
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

          {/* <View style={commonStyles.bottomButton}>
            <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
              <Text style={commonStyles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View> */}
          <View style={commonStyles.bottomButton}>
            <View style={commonStyles.buttonRow}>
              <TouchableOpacity 
                style={[commonStyles.button, { backgroundColor: colors.secondary }]} 
                onPress={handleSkip}
              >
                <Text style={commonStyles.buttonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={commonStyles.button} 
                onPress={handleNext}
              >
                <Text style={commonStyles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

export default BasicInfoScreen
