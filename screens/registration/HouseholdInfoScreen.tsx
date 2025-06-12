"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const HouseholdInfoScreen = ({ navigation, route }: any) => {
  const { householdName } = route.params

  const householdMembers = [
    { type: "Parent/Guardian", name: "John Smith" },
    { type: "Senior Citizen", name: "Mary Smith" },
    { type: "General User", name: "Sarah Smith" },
  ]

  const handleNext = () => {
    // Log household joining
    console.log("User joined household:", {
      householdName,
      members: householdMembers,
      timestamp: new Date().toISOString(),
    })

    navigation.navigate("LocationDetails")
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>←</Text>
          <Text style={commonStyles.backButtonText}>Household Information</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Household Information</Text>

          <View style={styles.contentContainer}>
            <Text style={styles.joinedText}>
              You are now part of <Text style={styles.householdName}>{householdName}</Text>
            </Text>

            <Text style={styles.membersTitle}>Household Members:</Text>

            <View style={styles.membersList}>
              {householdMembers.map((member, index) => (
                <View key={index} style={styles.memberItem}>
                  <Text style={styles.memberType}>{member.type}:</Text>
                  <Text style={styles.memberName}>{member.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
              <Text style={commonStyles.buttonText}>Next</Text>
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
    paddingHorizontal: 20,
  },
  joinedText: {
    fontSize: 18,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 30,
  },
  householdName: {
    fontWeight: "bold",
    color: colors.secondary,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  membersList: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 20,
  },
  memberItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  memberType: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    width: 140,
  },
  memberName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
})

export default HouseholdInfoScreen
