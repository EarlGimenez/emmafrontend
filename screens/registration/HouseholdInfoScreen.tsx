import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, commonStyles } from "../../styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";

// Define types for household members
interface HouseholdMember {
  name: string;
  type: string;
}

const HouseholdInfoScreen = ({ route, navigation }: any) => {
  const { householdName, familyId: scannedFamilyId, userData } = route.params;
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>(userData.householdMembers || []);
  const [joined, setJoined] = useState(false);

  const handleJoinFamily = async () => {
    try {
      const payload = {
        familyId: scannedFamilyId,
        userId: userData.userId,
      };

      const familyData = await fetcher(API_URLS.family.join, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (familyData.success) {
        setHouseholdMembers(familyData.members || []);
        setJoined(true);
      } else {
        alert("Failed to join family. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Connection error");
    }
  };

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
                householdMembers.map((member: HouseholdMember, index: number) => (
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
  );
};

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
});

export default HouseholdInfoScreen;