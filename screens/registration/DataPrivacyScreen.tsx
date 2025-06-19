"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const DataPrivacyScreen = ({ navigation }: any) => {
  const [hasRead, setHasRead] = useState(false)

  const handleConfirm = () => {
    if (hasRead) {
      navigation.navigate("AccountType")
    }
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Data Privacy Notice</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>

            <View style={styles.contentContainer}>
              <Text style={commonStyles.subtitle}>What We Collect</Text>
              <Text style={styles.content}>
                We collect the following personal information to assist with more efficient disaster response services:
                Name, Date of Birth, Contact Details, Home Address & Location, Government-issued IDs, and more to add. For
                children/minors, we collect their name, date of birth, and special needs (if any), with parental consent.
              </Text>

              <Text style={commonStyles.subtitle}>Why We Collect</Text>
              <Text style={styles.content}>
                Your information is used to verify your identity, prioritize assistance during disasters, and coordinate
                with government agencies like LGUs and DSWD. For children/minors, the information ensures their safety and
                access to emergency services.
              </Text>

              <Text style={commonStyles.subtitle}>How We Protect Your Data</Text>
              <Text style={styles.content}>
                We implement strict security measures to safeguard your information from unauthorized access, disclosure,
                or misuse. Your data is shared only with authorized government agencies, disaster response teams, and
                officially registered volunteers.
              </Text>

              <Text style={commonStyles.subtitle}>Your Rights</Text>
              <Text style={styles.content}>
                You have the right to access, correct, or delete your personal information. You may withdraw your consent
                at any time by contacting us at emma@gmail.com.
              </Text>

              <View style={styles.divider} />

              <Text style={commonStyles.subtitle}>Consent</Text>
              <Text style={styles.content}>
                By proceeding with registration, you consent to the collection, use, and sharing of your information as
                described in this notice.
              </Text>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setHasRead(!hasRead)}>
                <View style={[styles.checkbox, hasRead && styles.checkboxChecked]} />
                <Text style={styles.checkboxText}>I have read and understood the Data Privacy Notice and agree to the collection, use, and sharing of my information as described.</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity
              style={[commonStyles.button, !hasRead && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={!hasRead}
            >
              <Text style={commonStyles.buttonText}>Confirm</Text>
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
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
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

export default DataPrivacyScreen
