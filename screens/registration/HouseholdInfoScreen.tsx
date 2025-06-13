"use client"
import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"


const HouseholdInfoScreen = ({ route, navigation }: any) => {
  const { householdName, familyId: scannedFamilyId, userData } = route.params;
  const [userId, setUserId] = useState(userData.userId)
  const [familyId, setFamilyId] = useState(scannedFamilyId) 

  const [householdMembers, setHouseholdMembers] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);

  const handleJoinFamily = async () => {
    try {
      const payload = {
        qrCode: familyId,
        userId: userId
      };

      console.log('Submitting JSON:', JSON.stringify(payload));

      const familyData = await fetcher(API_URLS.family.join, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (familyData.success) {
        // Add the current user to the members list if not already present
        let updatedMembers = familyData.members || [];
        const alreadyMember = updatedMembers.some(
          (member: any) => member.name === userData.fullName
        );
        if (!alreadyMember) {
          updatedMembers = [
            ...updatedMembers,
            { name: userData.fullName, type: userData.accountType === "parent" ? "Parent/Guardian" : userData.accountType === "senior" ? "Senior Citizen" : "General User" }
          ];
        }
        setHouseholdMembers(updatedMembers);
        setJoined(true);
        // Do NOT navigate yet!
      } else {
        console.error('Failed to join family')
        alert('Failed to join family. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Connection error')
    }
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

          {joined ? (
            householdMembers.length === 0 ? (
              <Text style={{ textAlign: "center", color: colors.primary }}>
                You are the first member of this household: {userData?.fullName}
              </Text>
            ) : (
              householdMembers.map((member, index) => (
                <View key={index} style={styles.memberItem}>
                  <Text style={styles.memberType}>{member.type}:</Text>
                  <Text style={styles.memberName}>{member.name}</Text>
                </View>
              ))
            )
          ) : (
            <Text style={{ textAlign: "center", color: colors.primary }}>
              This household is currently empty.
            </Text>
          )}
        </View>

        <View style={commonStyles.bottomButton}>
          {!joined ? (
            <TouchableOpacity style={commonStyles.button} onPress={handleJoinFamily}>
              <Text style={commonStyles.buttonText}>Join Household</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={commonStyles.button}
              onPress={() =>
                navigation.navigate("LocationDetails", {
                  householdName,
                  householdMembers,
                })
              }
            >
              <Text style={commonStyles.buttonText}>Continue</Text>
            </TouchableOpacity>
          )}
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
  }, // Removed since we're using direct array display
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
