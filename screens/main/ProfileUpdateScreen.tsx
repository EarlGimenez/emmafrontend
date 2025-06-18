"use client";

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker"; // For date picker
import { colors, commonStyles } from "@/styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";

const ProfileUpdateScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute(); // Use useRoute hook to access route params
  const { userData: initialUserData } = route.params as { userData: any }; // Get initial user data

  // State variables for editable fields
  const [fullName, setFullName] = useState(initialUserData?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(initialUserData?.date_of_birth || "");
  const [contactNumber, setContactNumber] = useState(initialUserData?.contact_number || "");
  const [showDatePicker, setShowDatePicker] = useState(false); // State for showing date picker
  const [loading, setLoading] = useState(false); // Loading indicator for API call

  // Function to handle date change from DateTimePicker
  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false); // Hide date picker
    if (selectedDate) {
      // Format date to 'YYYY-MM-DD'
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDateOfBirth(`${year}-${month}-${day}`);
    }
  };

  // Handle profile update submission
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Construct the payload with updated fields
      const updatedProfileData = {
        name: fullName,
        dateOfBirth: dateOfBirth,
        contactNumber: contactNumber,
        // emailAddress: initialUserData?.email, // Email is often not editable or handled separately
        // password: initialUserData?.password, // Passwords are handled in a separate "Change Password" flow
      };

      // Send a PUT/PATCH request to update the user's profile
      // Assuming your backend has an endpoint like /api/users/{userId} for updates
      const response = await fetcher(API_URLS.users.profile, { // Assuming API_URLS.users.profile is actually /api/user for authenticated user
        method: "PUT", // Or PATCH
        body: JSON.stringify(updatedProfileData),
      });

      if (response.success) {
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack(); // Navigate back to the ProfileScreen to show updated data
      } else {
        // Handle backend validation errors or other API errors
        const errorMessage = response.errors ? Object.values(response.errors).flat().join("\n") : response.message || "Failed to update profile.";
        Alert.alert("Update Failed", errorMessage);
      }
    } catch (error: any) {
      console.error("ProfileUpdateScreen: Error updating profile:", error.message);
      Alert.alert("Error", "An error occurred while updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={commonStyles.mainThemeBackground}
    >
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Edit Profile</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={commonStyles.title}>Edit Profile</Text>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Full Name</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Date of Birth</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={commonStyles.input}>
                  {dateOfBirth || "Select Date of Birth"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Contact Number</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
            </View>

            {/* Email Address (read-only for display) */}
            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Email Address (Read-only)</Text>
              <TextInput
                style={[commonStyles.input, styles.readOnlyInput]}
                value={initialUserData?.email || "N/A"}
                editable={false} // Make it read-only
              />
            </View>

            <View style={commonStyles.bottomButton}>
              <TouchableOpacity
                style={commonStyles.button}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={commonStyles.buttonText}>Save Changes</Text>
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
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0', // Slightly different background for read-only fields
    color: '#888',
  }
});

export default ProfileUpdateScreen;
