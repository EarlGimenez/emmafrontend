"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 24
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12
const SCROLL_BOTTOM_SPACING = 140

const AdditionalInfoScreen = ({ navigation, route }: any) => {
  const { userData } = route.params
  const [specificNeeds, setSpecificNeeds] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState("")
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("")

  const handleNext = () => {
    const updatedUserData = {
      ...userData,
      additionalInfo: {
        specificNeeds,
        emergencyContact: {
          name: emergencyContactName,
          relationship: emergencyContactRelationship,
          contactNumber: emergencyContactNumber,
        },
      },
    }

    if (updatedUserData.accountType === "parent" || updatedUserData.accountType === "general") {
      navigation.navigate("HouseholdScan", { userData: updatedUserData })
    } else {
      navigation.navigate("LocationDetails", { userData: updatedUserData })
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginTop: HEADER_OFFSET }}
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={commonStyles.title}>Additional User Information</Text>

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

          <Text style={[commonStyles.subtitle, { textAlign: "center", marginBottom: 12 }]}>Emergency Contact</Text>

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

      <View style={styles.bottomBar}>
        <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
          <Text style={commonStyles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Registration" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
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
  textArea: { height: 110, paddingTop: 15 },
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default AdditionalInfoScreen
