"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

// Match RegistrationHeader geometry exactly
const HEADER_HEIGHT = 140
const DIP_HEIGHT = 24
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP)

const ParentInfoScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emailAddress, setEmailAddress] = useState("")

  const handleNext = () => {
    const parentData = { firstName, middleName, lastName, contactNumber, emailAddress }
    navigation.navigate("ParentVerification", { parentData })
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: HEADER_OFFSET, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={[commonStyles.title, styles.centerTitle]}>Parent/Guardian's Personal Information</Text>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>First Name</Text>
            <TextInput style={commonStyles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          </View>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Middle Name</Text>
            <TextInput style={commonStyles.input} placeholder="Middle Name" value={middleName} onChangeText={setMiddleName} />
          </View>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Last Name</Text>
            <TextInput style={commonStyles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
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
  scroll: { flex: 1 },
  centerTitle: { textAlign: "center" },
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

export default ParentInfoScreen
