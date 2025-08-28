"use client"

import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"

interface HouseholdMember {
  name: string
  type: string
}

const SHEET_RADIUS = 20

const HouseholdInfoScreen = ({ route, navigation }: any) => {
  const { householdName, familyId: scannedFamilyId, userData } = route.params
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>(userData.householdMembers || [])
  const [joined, setJoined] = useState(false)

  const handleJoinFamily = async () => {
    try {
      const payload = { familyId: scannedFamilyId, userId: userData.userId }
      const res = await fetcher(API_URLS.family.join, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.success) {
        setHouseholdMembers(res.members || [])
        setJoined(true)
      } else {
        alert("Failed to join family. Please try again.")
      }
    } catch (e) {
      alert("Connection error")
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Household Information</Text>
          <Text style={styles.sublead}>
            You are now part of <Text style={styles.highlight}>{householdName}</Text>
          </Text>

          <Text style={styles.sectionHead}>Household Members</Text>

          <View style={{ gap: 10 }}>
            {joined ? (
              householdMembers.length === 0 ? (
                <Text style={styles.centerMsg}>
                  You are the first member of this household: {userData?.fullName}
                </Text>
              ) : (
                householdMembers.map((m, i) => (
                  <View key={`${m.name}-${i}`} style={styles.memberRow}>
                    <Text style={styles.memberType}>{m.type}:</Text>
                    <Text style={styles.memberName}>{m.name}</Text>
                  </View>
                ))
              )
            ) : (
              <Text style={styles.centerMsg}>This household is currently empty.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
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
                userData,
              })
            }
          >
            <Text style={commonStyles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: SHEET_RADIUS,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    elevation: 4,
  },

  title: { fontSize: 22, fontWeight: "700", color: colors.primary, textAlign: "center", marginBottom: 10 },
  sublead: { fontSize: 16, color: colors.primary, textAlign: "center", marginBottom: 18 },
  highlight: { fontWeight: "700", color: colors.secondary },

  sectionHead: { fontSize: 18, fontWeight: "700", color: colors.primary, marginBottom: 10 },

  centerMsg: { textAlign: "center", color: colors.primary },

  memberRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  memberType: { width: 140, fontSize: 15, fontWeight: "600", color: colors.primary },
  memberName: { flex: 1, fontSize: 15, color: "#333" },

  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default HouseholdInfoScreen
