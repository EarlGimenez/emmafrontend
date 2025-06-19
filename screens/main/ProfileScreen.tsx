"use client";

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, commonStyles } from "@/styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); // State for delete loading

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetcher(API_URLS.users.profile);

      if (response && !response.error) {
        setUserData(response);
        await AsyncStorage.setItem("userData", JSON.stringify(response));
        console.log("ProfileScreen: User data fetched successfully from API.");
      } else {
        console.warn("ProfileScreen: Failed to fetch user data from API. Attempting AsyncStorage fallback.");
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
          console.log("ProfileScreen: Loaded user data from AsyncStorage.");
        } else {
          Alert.alert("Error", "Could not load user data. Please try logging in again.");
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userData");
          navigation.replace("Login");
        }
      }
    } catch (error: any) {
      console.error("ProfileScreen: Error fetching user data:", error.message);
      Alert.alert("Error", "Failed to load profile. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });
    fetchUserData();
    return unsubscribe;
  }, [navigation]);

  const handleEditProfile = () => {
    navigation.navigate("ProfileUpdate", { userData: userData });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Account deletion cancelled."),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              // Assuming your backend has a DELETE /api/user endpoint
              const response = await fetcher(API_URLS.users.profile, {
                method: "DELETE",
              });

              if (response.success) {
                Alert.alert("Success", "Your account has been successfully deleted.");
                await AsyncStorage.removeItem("userToken");
                await AsyncStorage.removeItem("userData");
                navigation.popToTop(); // Clear navigation stack
                navigation.replace("Login"); // Go to login screen
              } else {
                Alert.alert("Error", response.message || "Failed to delete account. Please try again.");
              }
            } catch (error: any) {
              console.error("ProfileScreen: Error deleting account:", error.message);
              Alert.alert("Error", "An error occurred while deleting account. Please try again.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
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
          <Text style={commonStyles.backButtonText}>← Profile</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={commonStyles.title}>My Profile</Text>

            {/* Profile Picture Section */}
            <View style={styles.profilePictureContainer}>
              <Ionicons name="person-circle-outline" size={80} color="#fff" />
              <Text style={styles.userName}>{userData?.name || "N/A"}</Text>
              <Text style={styles.userEmail}>{userData?.email || "N/A"}</Text>
            </View>

            {/* Profile Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Type:</Text>
                <Text style={styles.detailValue}>{userData?.account_type || "N/A"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, userData?.status === 'active' ? styles.statusActive : styles.statusPending]}>
                  {userData?.status ? userData.status.toUpperCase() : "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date of Birth:</Text>
                <Text style={styles.detailValue}>{userData?.date_of_birth || "N/A"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact Number:</Text>
                <Text style={styles.detailValue}>{userData?.contact_number || "N/A"}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={commonStyles.button} onPress={handleEditProfile}>
                <Text style={commonStyles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete Account</Text>
                )}
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
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  detailValue: {
    fontSize: 16,
    color: "#555",
  },
  statusActive: {
    color: "green",
    fontWeight: "bold",
  },
  statusPending: {
    color: "orange",
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center', // Center buttons horizontally
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red for delete action
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 15, // Space from Edit Profile button
    width: '80%', // Match commonStyles.button width
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
