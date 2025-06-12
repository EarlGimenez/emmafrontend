"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const ParentInfoScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emailAddress, setEmailAddress] = useState("")

  const handleNext = () => {
    const parentData = {
      firstName,
      middleName,
      lastName,
      contactNumber,
      emailAddress,
    }
    navigation.navigate("ParentVerification", { parentData })
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>←</Text>
          <Text style={commonStyles.backButtonText}>Parent/Guardian Information</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={commonStyles.title}>Parent/Guardian's Personal Information</Text>

            <View style={commonStyles.centeredContent}>
              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>First Name</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Middle Name</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Middle Name"
                  value={middleName}
                  onChangeText={setMiddleName}
                />
              </View>

              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Last Name</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
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

export default ParentInfoScreen