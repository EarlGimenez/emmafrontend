"use client";

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, commonStyles } from "@/styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";

const MyFamilyScreen = () => {
  const navigation = useNavigation<any>();
  const [familyId, setFamilyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentFamily, setCurrentFamily] = useState<any>(null);
  const [leavingFamily, setLeavingFamily] = useState(false); // State for leave family loading

  const fetchFamilyData = async () => {
    setLoading(true);
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (!storedUserData) {
        console.warn("MyFamilyScreen: No user data found in AsyncStorage. Cannot fetch family data.");
        setCurrentFamily(null); // Ensure no old family data is shown
        return;
      }
      const userData = JSON.parse(storedUserData);

      // Assuming your user data on the frontend (from /api/user) includes `family_id` if they are in a family.
      // If not, you might need a dedicated API endpoint like GET /api/user/family or similar.
      if (userData.family_id) {
        // Fetch family details using the family_id
        const response = await fetcher(API_URLS.family.get(userData.family_id));
        if (response && !response.error && response.id === userData.family_id) { // Basic check for consistency
          setCurrentFamily(response);
          console.log("MyFamilyScreen: Family data fetched successfully:", response);
        } else {
          console.warn("MyFamilyScreen: Failed to fetch detailed family data or user is no longer in family:", response?.message || "Unknown error.");
          setCurrentFamily(null);
          // Also clear family_id from local userData if backend says user is not in family
          const updatedUserData = { ...userData, family_id: null };
          await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
        }
      } else {
        console.log("MyFamilyScreen: User is not currently part of a family (no family_id in local data).");
        setCurrentFamily(null);
      }
    } catch (error: any) {
      console.error("MyFamilyScreen: Error fetching family data:", error.message);
      Alert.alert("Error", "Failed to load family information. Please check your network.");
      setCurrentFamily(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFamilyData();
    });
    fetchFamilyData();
    return unsubscribe;
  }, [navigation]);

  const handleJoinFamily = async () => {
    if (!familyId) {
      Alert.alert("Missing ID", "Please enter a Family ID to join.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetcher(API_URLS.family.join, {
        method: "POST",
        body: JSON.stringify({ family_id: familyId }),
      });

      if (response.success) {
        Alert.alert("Success", response.message || "Successfully joined family!");
        // Update local user data with new family_id if response provides it
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            const updatedUserData = { ...userData, family_id: familyId }; // Assume family_id is what you get back
            await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
        }
        fetchFamilyData(); // Refresh family data from backend
        setFamilyId(""); // Clear input
      } else {
        const errorMessage = response.errors ? Object.values(response.errors).flat().join("\n") : response.message || "Failed to join family.";
        Alert.alert("Join Failed", errorMessage);
      }
    } catch (error: any) {
      console.error("MyFamilyScreen: Error joining family:", error.message);
      Alert.alert("Error", "An error occurred while trying to join family. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveFamily = () => {
    console.log("Leave Family Pressed");
    // if (!currentFamily) {
    //   Alert.alert("Not in Family", "You are not currently part of a family.");
    //   return;
    // }

    // Alert.alert(
    //   "Leave Family",
    //   `Are you sure you want to leave ${currentFamily.name}? This action cannot be undone.`,
    //   [
    //     {
    //       text: "Cancel",
    //       style: "cancel",
    //       onPress: () => console.log("Leave family cancelled."),
    //     },
    //     {
    //       text: "Leave",
    //       style: "destructive",
    //       onPress: async () => {
    //         setLeavingFamily(true);
    //         try {
    //           // Assuming a DELETE /api/family/{familyId}/leave or POST /api/leave-family
    //           // We'll use a DELETE request to /api/family/{familyId} and assume it handles leaving
    //           // OR a specific POST endpoint for leaving a family.
    //           // For simplicity, let's assume a DELETE to a user-specific family endpoint
    //           // or POST to a generic leave endpoint.
    //           // A more robust API might be POST /api/family/leave
    //           const response = await fetcher(API_URLS.family.leave || `${API_URLS.family.get(currentFamily.id)}/leave`, { // Placeholder for a dedicated leave endpoint
    //             method: "POST", // POST is safer for actions than DELETE on a resource
    //             // If your API requires the family_id in the body for POST /api/leave-family
    //             body: JSON.stringify({ family_id: currentFamily.id }),
    //           });

    //           if (response.success) {
    //             Alert.alert("Success", "You have successfully left the family.");
    //             // Clear family_id from local user data
    //             const storedUserData = await AsyncStorage.getItem("userData");
    //             if (storedUserData) {
    //                 const userData = JSON.parse(storedUserData);
    //                 const updatedUserData = { ...userData, family_id: null };
    //                 await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
    //             }
    //             fetchFamilyData(); // Refresh family data to show user is no longer in a family
    //           } else {
    //             Alert.alert("Error", response.message || "Failed to leave family. Please try again.");
    //           }
    //         } catch (error: any) {
    //           console.error("MyFamilyScreen: Error leaving family:", error.message);
    //           Alert.alert("Error", "An error occurred while leaving family. Please try again.");
    //         } finally {
    //           setLeavingFamily(false);
    //         }
    //       },
    //     },
    //   ],
    //   { cancelable: true }
    // );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Family Info...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={commonStyles.mainThemeBackground}
    >
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← My Family</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={commonStyles.title}>My Family</Text>

            <View style={styles.familyBanner}>
                {/* Family banner placeholder - replace with image or content as needed */}
            </View>

            {/* Display Current Family Information */}
            {currentFamily ? (
              <View style={styles.familyInfoContainer}>
                <Text style={styles.familyInfoTitle}>Current Family: {currentFamily.name}</Text>
                <Text style={styles.familyInfoText}>Family ID: {currentFamily.id}</Text>
                <Text style={styles.familyInfoMembers}>Members:</Text>
                {currentFamily.members && currentFamily.members.length > 0 ? (
                  currentFamily.members.map((member: any) => (
                    <Text key={member.id} style={styles.memberText}>
                      - {member.name} ({member.relation || "Member"})
                    </Text>
                  ))
                ) : (
                  <Text style={styles.memberText}>No members listed.</Text>
                )}
                <TouchableOpacity
                  style={styles.leaveFamilyButton}
                  onPress={handleLeaveFamily}
                  disabled={leavingFamily}
                >
                  {leavingFamily ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.leaveFamilyButtonText}>Leave Family</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noFamilyContainer}>
                <Text style={styles.noFamilyText}>You are not currently part of a family.</Text>
              </View>
            )}

            {/* Join Family Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Join an Existing Family</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Enter Family ID"
                value={familyId}
                onChangeText={setFamilyId}
                keyboardType="default"
              />
              <TouchableOpacity
                style={commonStyles.button}
                onPress={handleJoinFamily}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={commonStyles.buttonText}>Join Family</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Placeholder for other family actions like 'Track Family Member' */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Other Family Actions</Text>
              <TouchableOpacity style={commonStyles.button}>
                <Text style={commonStyles.buttonText}>Track Family Members</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  familyBanner: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionContainer: {
    width: "100%",
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  noFamilyContainer: {
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noFamilyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  familyInfoContainer: {
    width: "100%",
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  familyInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  familyInfoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  familyInfoMembers: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 10,
    marginBottom: 5,
  },
  memberText: {
    fontSize: 15,
    color: "#666",
    marginLeft: 10,
  },
  leaveFamilyButton: {
    backgroundColor: '#dc3545', // Red for delete action
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    width: '100%',
  },
  leaveFamilyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MyFamilyScreen;
