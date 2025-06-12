"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const AdditionalInfoScreen = ({ navigation, route }: any) => {
  const { userData } = route.params
  const [specificNeeds, setSpecificNeeds] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState("")
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("")

  const handleNext = () => {
    const completeUserData = {
      ...userData,
      specificNeeds,
      emergencyContact: {
        name: emergencyContactName,
        relationship: emergencyContactRelationship,
        contactNumber: emergencyContactNumber,
      },
      timestamp: new Date().toISOString(),
    }

    console.log("Additional user information collected:", completeUserData)

    // Navigate to household scan instead of showing alert
    navigation.navigate("HouseholdScan", { userData: completeUserData })
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>←</Text>
          <Text style={commonStyles.backButtonText}>Additional User Information</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            <Text style={commonStyles.title}>Additional User Information</Text>

            <View style={commonStyles.centeredContent}>
              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Specific Needs</Text>
                <TextInput
                  style={[commonStyles.input, styles.textArea]}
                  placeholder="Please describe any specific needs or requirements"
                  value={specificNeeds}
                  onChangeText={setSpecificNeeds}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <Text style={[commonStyles.subtitle, { textAlign: "center", marginBottom: 20 }]}>Emergency Contact</Text>

              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Name</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Name"
                  value={emergencyContactName}
                  onChangeText={setEmergencyContactName}
                />
              </View>

              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Relationship</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Relationship"
                  value={emergencyContactRelationship}
                  onChangeText={setEmergencyContactRelationship}
                />
              </View>

              <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.fieldLabel}>Contact Number</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Contact Number"
                  value={emergencyContactNumber}
                  onChangeText={setEmergencyContactNumber}
                  keyboardType="phone-pad"
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

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    paddingBottom: 100,
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
})

export default AdditionalInfoScreen
