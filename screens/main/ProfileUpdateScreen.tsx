// ProfileUpdateScreen.tsx
"use client";

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, DrawerActions } from "@react-navigation/native"; // Added DrawerActions
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons"; // For back arrow and notification
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For check-decagram-outline and pencil icons
import { colors, commonStyles } from "@/styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";

const ProfileUpdateScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { userData: initialUserData } = route.params as { userData: any };

  const [fullName, setFullName] = useState(initialUserData?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(initialUserData?.date_of_birth || "");
  const [contactNumber, setContactNumber] = useState(initialUserData?.contact_number || "");
  const [emailAddress, setEmailAddress] = useState(initialUserData?.email || ""); // Email as state for display consistency
  const [password, setPassword] = useState("********"); // Placeholder for password, not actual value
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // States to control which field is being edited
  const [editingFullName, setEditingFullName] = useState(false);
  const [editingContactNumber, setEditingContactNumber] = useState(false);
  const [editingEmailAddress, setEditingEmailAddress] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDateOfBirth(`${year}-${month}-${day}`);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updatedProfileData = {
        name: fullName,
        date_of_birth: dateOfBirth, // Ensure key matches backend expected format
        contact_number: contactNumber, // Ensure key matches backend expected format
        // Email and password usually updated via separate flows for security
        email: emailAddress, // Include email if it's meant to be editable here
      };

      const response = await fetcher(API_URLS.users.profile, {
        method: "PUT",
        body: JSON.stringify(updatedProfileData),
      });

      if (response.success) {
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={30} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Notification Bell Pressed')} style={styles.notificationBell}>
          <Ionicons name="notifications" size={26} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
          <View style={styles.nameEditContainer}>
            {editingFullName ? (
              <TextInput
                style={styles.userNameInput}
                value={fullName}
                onChangeText={setFullName}
                onBlur={() => setEditingFullName(false)}
                autoFocus
              />
            ) : (
              <Text style={styles.userName}>{fullName}</Text>
            )}
            <TouchableOpacity onPress={() => setEditingFullName(true)}>
              <MaterialCommunityIcons name="pencil-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {initialUserData?.account_type && (
            <Text style={styles.userAccountType}>{initialUserData.account_type.toUpperCase()}</Text>
          )}
          {initialUserData?.status === 'active' && (
            <View style={styles.verifiedStatus}>
              <MaterialCommunityIcons name="check-decagram-outline" size={18} color="#007bff" />
              <Text style={styles.verifiedText}>Fully Verified</Text>
            </View>
          )}
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>DATE OF BIRTH</Text>
            <View style={styles.valueEditContainer}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.touchableDetailValue}>
                <Text style={styles.detailValue}>
                  {dateOfBirth || "Select Date"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#666" />
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
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>CONTACT NUMBER</Text>
            <View style={styles.valueEditContainer}>
              {editingContactNumber ? (
                <TextInput
                  style={styles.detailValueInput}
                  value={contactNumber}
                  onChangeText={setContactNumber}
                  keyboardType="phone-pad"
                  onBlur={() => setEditingContactNumber(false)}
                  autoFocus
                />
              ) : (
                <Text style={styles.detailValue}>{contactNumber || "N/A"}</Text>
              )}
              <TouchableOpacity onPress={() => setEditingContactNumber(true)}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
            <View style={styles.valueEditContainer}>
              {editingEmailAddress ? (
                <TextInput
                  style={styles.detailValueInput}
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  onBlur={() => setEditingEmailAddress(false)}
                  autoFocus
                />
              ) : (
                <Text style={styles.detailValue}>{emailAddress || "N/A"}</Text>
              )}
              <TouchableOpacity onPress={() => setEditingEmailAddress(true)}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.detailRow, styles.lastDetailRow]}>
            <Text style={styles.detailLabel}>PASSWORD</Text>
            <View style={styles.valueEditContainer}>
              {editingPassword ? (
                <TextInput
                  style={styles.detailValueInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onBlur={() => setEditingPassword(false)}
                  autoFocus
                />
              ) : (
                <Text style={styles.detailValue}>********</Text>
              )}
              <TouchableOpacity onPress={() => setEditingPassword(true)}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Register PWD/Senior ID */}
        <TouchableOpacity style={styles.registerIdButton} onPress={() => Alert.alert("Register ID", "Navigate to PWD/Senior ID registration screen.")}>
          <MaterialCommunityIcons name="wheelchair-accessibility" size={24} color={colors.primary} />
          <Text style={styles.registerIdButtonText}>Register PWD/Senior ID</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={commonStyles.button}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={commonStyles.buttonText}>Confirm Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Header background color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Adjust for status bar
    paddingBottom: 20,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
  },
  backIcon: {
    padding: 5,
  },
  notificationBell: {
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: colors.white, // White background for the content area
    borderTopLeftRadius: 0, // No border radius
    borderTopRightRadius: 0, // No border radius
    paddingVertical: 20,
    paddingHorizontal: 0, // Individual rows will have horizontal padding
    alignItems: "center",
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: 10,
  },
  userNameInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minWidth: 150,
    textAlign: 'center',
  },
  userAccountType: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  verifiedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  verifiedText: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: '600',
    marginLeft: 5,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: colors.white,
    marginBottom: 30,
  },
  detailRow: {
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 20, // Padding for content within the row
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  valueEditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  detailValue: {
    fontSize: 16,
    color: "#555",
    flex: 1, // Allow text to take space
  },
  detailValueInput: {
    fontSize: 16,
    color: "#555",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 2,
  },
  touchableDetailValue: {
    flex: 1, // Make the touchable area expand
    paddingVertical: 2, // Add some padding for easier tap
  },
  registerIdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 0, // No border radius
    marginBottom: 30,
    width: '100%',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  registerIdButtonText: {
    flex: 1, // Take up available space
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 15,
  },
  bottomButtonContainer: {
    width: '80%', // Match the width of the button in commonStyles
    alignSelf: 'center', // Center the container
    marginBottom: 30, // Space from bottom
  },
});

export default ProfileUpdateScreen;