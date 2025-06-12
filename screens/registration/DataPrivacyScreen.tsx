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
            <Text style={commonStyles.title}>Data Privacy Notice</Text>

            <View style={styles.contentContainer}>
              <Text style={commonStyles.subtitle}>What We Collect</Text>
              <Text style={styles.content}>
                We collect personal information necessary for emergency management and monitoring purposes.
              </Text>

              <Text style={commonStyles.subtitle}>Why We Collect</Text>
              <Text style={styles.content}>
                Your data helps us provide effective evacuation management and monitoring services.
              </Text>

              <Text style={commonStyles.subtitle}>How We Protect Your Data</Text>
              <Text style={styles.content}>
                We implement industry-standard security measures to protect your personal information.
              </Text>

              <Text style={commonStyles.subtitle}>Your Rights</Text>
              <Text style={styles.content}>
                You have the right to access, modify, and delete your personal information.
              </Text>

              <View style={styles.divider} />

              <Text style={commonStyles.subtitle}>Consent</Text>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setHasRead(!hasRead)}>
                <View style={[styles.checkbox, hasRead && styles.checkboxChecked]} />
                <Text style={styles.checkboxText}>I have read and understood the Data Privacy Notice</Text>
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
    marginBottom: 15,
    lineHeight: 20,
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

export default DataPrivacyScreen
