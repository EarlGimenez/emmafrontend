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

   const handleNext = async () => {
    try {
      const response = await fetcher(API_URLS.users.temp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          fullName,
          dateOfBirth,
          contactNumber,
          emailAddress
        }),
      });

      if (response.success && response.userId) {
        const userDataWithId = {
          userId: response.userId,
          accountType,
          fullName,
          dateOfBirth,
          contactNumber,
          emailAddress,
          verificationStatus: 'pending'
        };

        // Route to appropriate verification screen
        const verificationRoutes = {
          pwd: "PWDVerification",
          senior: "SeniorVerification",
          parent: "GeneralVerification",
          general: "GeneralVerification"
        };

        const nextScreen = verificationRoutes[accountType as keyof typeof verificationRoutes] || "GeneralVerification";
        navigation.navigate(nextScreen, { userData: userDataWithId });
      } else {
        throw new Error(response.message || 'Failed to create temporary user');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Network error. Please try again.');
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
