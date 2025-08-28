"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 56
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12

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
    navigation.navigate("BasicInfo", { accountType: type })
  }

  const handleChildRegistration = () => {
    navigation.navigate("ParentalConsent")
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginTop: HEADER_OFFSET }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={commonStyles.title}>Are you a...</Text>

          <Text style={styles.subtitle}>Select account holder type</Text>

          <View style={{ gap: 12 }}>
            {accountTypes.map((type) => (
              <TouchableOpacity key={type.id} style={styles.typeButton} onPress={() => handleTypeSelect(type.id)}>
                <Text style={styles.typeButtonText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.childText}>Are you registering for a child/minor?</Text>
          <TouchableOpacity style={styles.childButton} onPress={handleChildRegistration}>
            <Text style={commonStyles.buttonText}>Register for a Child/Minor</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  subtitle: { fontSize: 16, color: colors.primary, marginBottom: 16, textAlign: "center" },
  typeButton: {
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  typeButtonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 20 },
  childText: { fontSize: 16, color: colors.primary, textAlign: "center", marginBottom: 12 },
  childButton: {
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default AccountTypeScreen
