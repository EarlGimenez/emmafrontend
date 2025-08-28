"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native"

import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 24
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12
const SCROLL_BOTTOM_SPACING = 140

const ChildInfoScreen = ({ navigation, route }: any) => {
  const { parentData } = route.params
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [contactNumber, setContactNumber] = useState("")

  const handleNext = () => {
    const completeData = {
      registrationType: "child",
      parentData,
      childData: { fullName, dateOfBirth, contactNumber },
    }
    navigation.navigate("HouseholdScan", { userData: completeData })
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginTop: HEADER_OFFSET }}
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={commonStyles.title}>Child’s Personal Information</Text>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Full Name</Text>
            <TextInput style={commonStyles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
          </View>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Date of Birth</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="MM/DD/YYYY"
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
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
          <Text style={commonStyles.buttonText}>Complete Registration</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Child Registration" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default ChildInfoScreen
