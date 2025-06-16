// screens/HomeScreen.tsx (Create this file)

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetcher } from '@/utils/fetcher';
import { API_URLS } from '@/config/api';
import { colors, commonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch the authenticated user's profile from the backend
        const response = await fetcher(API_URLS.users.profile);
        if (response) {
          setUserData(response);
        }
      } catch (error: any) {
        console.error("Failed to fetch user profile:", error.message);
        Alert.alert("Error", "Could not load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetcher(API_URLS.auth.logout, { method: 'POST' });
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      Alert.alert("Logged Out", "You have been successfully logged out.");
      navigation.replace('Login'); // Go back to login screen
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      Alert.alert("Logout Error", "Failed to log out.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={commonStyles.mainThemeBackground}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {userData?.name || 'User'}!</Text>
        <Text style={styles.emailText}>Email: {userData?.email}</Text>
        <Text style={styles.statusText}>Status: {userData?.status}</Text>
        {userData?.consents && (
          <View style={styles.consentsContainer}>
            <Text style={styles.consentTitle}>Consents:</Text>
            <Text>Data Sharing: {userData.consents.dataSharing ? 'Yes' : 'No'}</Text>
            <Text>Alerts: {userData.consents.alerts ? 'Yes' : 'No'}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={commonStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.white,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.white,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.white,
  },
  consentsContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '80%',
    alignItems: 'flex-start',
  },
  consentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.white,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    width: 200,
  },
});

export default HomeScreen;