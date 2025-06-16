"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import DateTimePicker from "@react-native-community/datetimepicker"
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
          emailAddress,
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
      // Log the full error object for debugging
      console.error(error);
      // If the backend returned a response, log it for debugging
      if (error?.response) {
        console.error('Backend response:', error.response);
      }
      alert(error.message || 'Network error. Please try again.');
    }
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

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
              <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={commonStyles.input}
              activeOpacity={0.8}
              >
              <Text>
                {dateOfBirth ? dateOfBirth : "Date of Birth (MM/DD/YYYY)"}
              </Text>
              </TouchableOpacity>
              {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  // Format to YYYY-MM-DD for Laravel validator
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const day = String(selectedDate.getDate()).padStart(2, '0');
                  const formatted = `${year}-${month}-${day}`;
                  setDateOfBirth(formatted);
                }
                }}
              />
              )}
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
