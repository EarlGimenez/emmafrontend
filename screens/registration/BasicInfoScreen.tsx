"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 24
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12
const SCROLL_BOTTOM_SPACING = 140

const BasicInfoScreen = ({ navigation, route }: any) => {
  const { accountType } = route.params
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleNext = async () => {
    try {
      const response = await fetcher(API_URLS.users.temp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountType, fullName, dateOfBirth, contactNumber, emailAddress }),
      })

      if (response.success && response.userId) {
        const userDataWithId = {
          userId: response.userId,
          accountType,
          fullName,
          dateOfBirth,
          contactNumber,
          emailAddress,
          verificationStatus: "pending",
        }

        const verificationRoutes = {
          pwd: "PWDVerification",
          senior: "SeniorVerification",
          parent: "GeneralVerification",
          general: "GeneralVerification",
        } as const

        const nextScreen = verificationRoutes[accountType as keyof typeof verificationRoutes] || "GeneralVerification"
        navigation.navigate(nextScreen, { userData: userDataWithId })
      } else {
        throw new Error(response.message || "Failed to create temporary user")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      if (error?.response) console.error("Backend response:", error.response)
      alert(error.message || "Network error. Please try again.")
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
          <Text style={commonStyles.title}>Basic Personal Information</Text>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Full Name</Text>
            <TextInput style={commonStyles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
          </View>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={commonStyles.input} activeOpacity={0.8}>
              <Text>{dateOfBirth ? dateOfBirth : "Date of Birth (YYYY-MM-DD)"}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false)
                  if (selectedDate) {
                    const year = selectedDate.getFullYear()
                    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
                    const day = String(selectedDate.getDate()).padStart(2, "0")
                    const formatted = `${year}-${month}-${day}`
                    setDateOfBirth(formatted)
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
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default BasicInfoScreen
