import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import for check-decagram-outline
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

  const handleUpdateAccountInformation = () => {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => console.log('Notification Bell Pressed')} style={styles.notificationBell}>
          <Ionicons name="notifications" size={26} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Main Content ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
          <Text style={styles.userName}>{userData?.name || "N/A"}</Text>
          {userData!.account_type && (
            <Text style={styles.userAccountType}>{userData.account_type.toUpperCase()}</Text>
          )}
          {userData?.status === 'active' && (
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
            <Text style={styles.detailValue}>{userData?.date_of_birth || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>CONTACT NUMBER</Text>
            <Text style={styles.detailValue}>{userData?.contact_number || "N/A"}</Text>
          </View>
          <View style={[styles.detailRow, styles.lastDetailRow]}> {/* lastDetailRow for no bottom border */}
            <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
            <Text style={styles.detailValue}>{userData?.email || "N/A"}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={commonStyles.button} onPress={handleUpdateAccountInformation}>
            <Text style={commonStyles.buttonText}>Update Account Information</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButtonTextOnly}
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#dc3545" />
            ) : (
              <Text style={styles.deleteButtonTextOnlyColor}>Delete Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Primary color for header background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Adjust for status bar
    paddingBottom: 20,
    backgroundColor: colors.primary,
    justifyContent: 'space-between', // Space out header elements
  },
  menuIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1, // Allow title to take available space
    textAlign: 'center', // Center the title
    // No marginLeft here, flex:1 and justifyContent: 'space-between' handle centering
  },
  notificationBell: {
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0, // No border radius as per image
    borderTopRightRadius: 0, // No border radius as per image
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 10, // Space from icon
  },
  userAccountType: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5, // Space from name
  },
  verifiedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  verifiedText: {
    fontSize: 14,
    color: "#007bff", // Blue color for verified status
    fontWeight: '600',
    marginLeft: 5,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: colors.white, // White background as per image
    borderRadius: 0, // No border radius
    paddingHorizontal: 0, // No horizontal padding for the container itself
    marginBottom: 30,
    // No shadow as per image
  },
  detailRow: {
    flexDirection: "column", // Stack label and value vertically
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Light grey border
    width: '100%',
    paddingHorizontal: 20, // Add horizontal padding for rows
    alignItems: 'flex-start', // Align text to start
  },
  lastDetailRow: {
    borderBottomWidth: 0, // No border for the last row
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5, // Space between label and value
  },
  detailValue: {
    fontSize: 16,
    color: "#555",
  },
  actionButtonsContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center', // Center buttons horizontally
  },
  deleteButtonTextOnly: {
    padding: 10, // Provide some tap area
    marginTop: 15,
    alignItems: 'center',
  },
  deleteButtonTextOnlyColor: {
    color: '#dc3545', // Red color for delete action
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;