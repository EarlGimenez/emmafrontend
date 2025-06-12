"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const AccountTypeScreen = ({ navigation }: any) => {
  const [selectedType, setSelectedType] = useState("")

  const accountTypes = [
    { id: "pwd", label: "Person with Disability (PWD)" },
    { id: "senior", label: "Senior Citizen" },
    { id: "parent", label: "Parent / Guardian" },
    { id: "general", label: "General User" },
  ]

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    // Navigate to BasicInfo with the selected type
    navigation.navigate("BasicInfo", { accountType: type })
  }

  const handleChildRegistration = () => {
    navigation.navigate("ParentalConsent")
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>←</Text>
          <Text style={commonStyles.backButtonText}>Registration</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Are you a...</Text>

          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>Select account holder type</Text>

            {accountTypes.map((type) => (
              <TouchableOpacity key={type.id} style={styles.typeButton} onPress={() => handleTypeSelect(type.id)}>
                <Text style={styles.typeButtonText}>{type.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            <Text style={styles.childText}>Are you registering for a child/minor?</Text>
          </View>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity style={styles.childButton} onPress={handleChildRegistration}>
              <Text style={commonStyles.buttonText}>Register for a Child/Minor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  typeButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 20,
    justifyContent: "center",
  },
  typeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  childText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 15,
  },
  childButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 250,
  },
})

export default AccountTypeScreen
