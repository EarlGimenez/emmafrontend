"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const ChildInfoScreen = ({ navigation, route }: any) => {
  const { parentData } = route.params
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [contactNumber, setContactNumber] = useState("")

  const handleNext = () => {
    const completeData = {
      parentData,
      childData: {
        fullName,
        dateOfBirth,
        contactNumber,
      },
    }

    // Here you would typically send the data to your Laravel backend
    console.log("Complete Child Registration Data:", completeData)

    Alert.alert("Registration Complete", "Child registration has been submitted successfully!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Login"),
      },
    ])
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Child Information</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Child's Personal Information</Text>

          <TextInput style={commonStyles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />

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

          <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
            <Text style={commonStyles.buttonText}>Complete Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

export default ChildInfoScreen
