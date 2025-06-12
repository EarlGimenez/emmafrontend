"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const ParentalConsentScreen = ({ navigation }: any) => {
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    if (confirmed) {
      navigation.navigate("ParentInfo")
    }
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Parental Consent</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={commonStyles.title}>Parental Consent Form</Text>

            <Text style={styles.noticeText}>If you are registering for a child, please note:</Text>

            <View style={styles.divider} />

            <Text style={styles.consentText}>By proceeding, you confirm that:</Text>

            <Text style={styles.bulletPoint}>• You are the parent or legal guardian of the child</Text>
            <Text style={styles.bulletPoint}>
              • You have the authority to provide consent for the child's registration
            </Text>
            <Text style={styles.bulletPoint}>• You understand the data collection and privacy policies</Text>
            <Text style={styles.bulletPoint}>• You consent to the processing of the child's personal information</Text>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setConfirmed(!confirmed)}>
              <View style={[styles.checkbox, confirmed && styles.checkboxChecked]} />
              <Text style={styles.checkboxText}>
                I confirm that I am the parent/guardian and consent to this registration
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[commonStyles.button, !confirmed && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={!confirmed}
            >
              <Text style={commonStyles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  noticeText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 15,
  },
  consentText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 15,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    paddingLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
})

export default ParentalConsentScreen
