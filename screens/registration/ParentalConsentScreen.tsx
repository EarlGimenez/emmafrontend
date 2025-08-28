"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 56
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12
const SCROLL_BOTTOM_SPACING = 140

const ParentalConsentScreen = ({ navigation }: any) => {
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    if (confirmed) navigation.navigate("ParentInfo")
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginTop: HEADER_OFFSET }}
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={commonStyles.title}>Parental Consent Form</Text>

          <Text style={styles.noticeText}>If you are registering for a child, please note:</Text>

          <View style={styles.divider} />

          <Text style={styles.consentText}>By proceeding, you confirm that:</Text>

          <Text style={styles.bulletPoint}>• You are the parent or legal guardian of the child</Text>
          <Text style={styles.bulletPoint}>• You have the authority to provide consent for the child's registration</Text>
          <Text style={styles.bulletPoint}>• You understand the data collection and privacy policies</Text>
          <Text style={styles.bulletPoint}>• You consent to the processing of the child's personal information</Text>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setConfirmed(!confirmed)}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked]} />
            <Text style={styles.checkboxText}>
              I confirm that I am the parent/guardian and consent to this registration
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[commonStyles.button, !confirmed && { opacity: 0.5 }]}
          onPress={handleConfirm}
          disabled={!confirmed}
        >
          <Text style={commonStyles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Registration" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white || "#F5F5F5" },
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
  noticeText: { fontSize: 16, color: colors.primary, fontWeight: "600", marginBottom: 15 },
  consentText: { fontSize: 16, color: colors.primary, fontWeight: "600", marginBottom: 15 },
  bulletPoint: { fontSize: 14, color: "#333", marginBottom: 8, paddingLeft: 10 },
  divider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 15 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: colors.primary, marginRight: 12, borderRadius: 4 },
  checkboxChecked: { backgroundColor: colors.primary },
  checkboxText: { fontSize: 14, color: "#333", flex: 1 },
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default ParentalConsentScreen
