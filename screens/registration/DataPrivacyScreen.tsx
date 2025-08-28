"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

// Must mirror the metrics used in RegistrationHeader
const HEADER_HEIGHT = 140
const DIP_HEIGHT = 24
const DIP_OVERLAP = 24
// Remove extra padding; use precise geometry only
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP)

const DataPrivacyScreen = ({ navigation }: any) => {
  const [hasRead, setHasRead] = useState(false)

  const handleConfirm = () => {
    if (hasRead) navigation.navigate("AccountType")
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: HEADER_OFFSET, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={[commonStyles.subtitle, styles.centerTitle]}>What We Collect</Text>
          <Text style={styles.content}>
            We collect the following personal information to assist with more efficient disaster response services:
            Name, Date of Birth, Contact Details, Home Address & Location, Government-issued IDs, and more to add. For
            children/minors, we collect their name, date of birth, and special needs (if any), with parental consent.
          </Text>

          <Text style={[commonStyles.subtitle, styles.centerTitle]}>Why We Collect</Text>
          <Text style={styles.content}>
            Your information is used to verify your identity, prioritize assistance during disasters, and coordinate
            with government agencies like LGUs and DSWD. For children/minors, the information ensures their safety and
            access to emergency services.
          </Text>

          <Text style={[commonStyles.subtitle, styles.centerTitle]}>How We Protect Your Data</Text>
          <Text style={styles.content}>
            We implement strict security measures to safeguard your information from unauthorized access, disclosure,
            or misuse. Your data is shared only with authorized government agencies, disaster response teams, and
            officially registered volunteers.
          </Text>

          <Text style={[commonStyles.subtitle, styles.centerTitle]}>Your Rights</Text>
          <Text style={styles.content}>
            You have the right to access, correct, or delete your personal information. You may withdraw your consent
            at any time by contacting us at emma@gmail.com.
          </Text>

          <View style={styles.divider} />

          <Text style={[commonStyles.subtitle, styles.centerTitle]}>Consent</Text>
          <Text style={styles.content}>
            By proceeding with registration, you consent to the collection, use, and sharing of your information as
            described in this notice.
          </Text>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setHasRead(!hasRead)}>
            <View style={[styles.checkbox, hasRead && styles.checkboxChecked]} />
            <Text style={styles.checkboxText}>
              I have read and understood the Data Privacy Notice and agree to the collection, use, and sharing of my
              information as described.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[commonStyles.button, !hasRead && styles.disabledButton]}
          onPress={handleConfirm}
          disabled={!hasRead}
        >
          <Text style={commonStyles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Data Privacy Notice" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  centerTitle: { textAlign: "center" },
  content: { fontSize: 14, color: "#333", marginBottom: 12, lineHeight: 20 },
  divider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 12 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: colors.primary, marginRight: 12, borderRadius: 4 },
  checkboxChecked: { backgroundColor: colors.primary },
  checkboxText: { fontSize: 14, color: "#333", flex: 1 },
  disabledButton: { opacity: 0.5 },
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default DataPrivacyScreen
