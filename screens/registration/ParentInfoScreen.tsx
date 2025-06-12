"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const ParentInfoScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emailAddress, setEmailAddress] = useState("")

  const handleNext = () => {
    const parentData = {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      contactNumber,
      emailAddress,
    }
    navigation.navigate("ParentVerification", { parentData })
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Parent/Guardian Information</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Parent/Guardian's Personal Information</Text>

          <TextInput
            style={commonStyles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={commonStyles.input}
            placeholder="Middle Name"
            value={middleName}
            onChangeText={setMiddleName}
          />

          <TextInput style={commonStyles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />

          <TextInput
            style={commonStyles.input}
            placeholder="Date of Birth (MM/DD/YYYY)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />

          <TextInput
            style={commonStyles.input}
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />

          <TextInput
            style={commonStyles.input}
            placeholder="Email Address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
            <Text style={commonStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

export default ParentInfoScreen
