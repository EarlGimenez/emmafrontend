"use client";

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, commonStyles } from "@/styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api"; // Assuming API_URLS for user profile

const RequestEntryScreen = () => {
  const navigation = useNavigation<any>();
  const [userName, setUserName] = useState("User"); // Default name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserName = async () => {
      setLoading(true);
      try {
        // Attempt to fetch fresh user data from API
        const apiUserData = await fetcher(API_URLS.users.profile);
        if (apiUserData && !apiUserData.error && apiUserData.name) {
          setUserName(apiUserData.name);
          await AsyncStorage.setItem('userData', JSON.stringify(apiUserData)); // Update local storage
        } else {
          // Fallback to AsyncStorage if API fails or name is not present
          const storedUserData = await AsyncStorage.getItem("userData");
          if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            if (parsedData.name) {
              setUserName(parsedData.name);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load user name:", error);
        // Alert already handled by fetcher
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadUserName();
    });

    loadUserName(); // Initial load
    return unsubscribe;
  }, [navigation]);

  const handleRequestNow = () => {
    navigation.navigate("RequestProcess"); // Navigate to the multi-step request screen
  };

  const handleMyRequests = () => {
    navigation.navigate("MyRequests"); // Navigate to the screen displaying past requests
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={commonStyles.backButtonText}>← Assistance Center</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={commonStyles.title}>Assistance Center</Text>

            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeMessage}>Hello {userName},</Text>
              <Text style={styles.welcomeMessage}>Welcome to Assistance Center!</Text>
            </View>
            <View style={{ width: 200, height: 200, backgroundColor: colors.fieldBg, borderRadius: 20, marginBottom: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>[Image Placeholder]</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleRequestNow}>
                <Text style={styles.actionButtonText}>Request Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleMyRequests}>
                <Text style={styles.actionButtonText}>My Requests</Text>
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
  welcomeSection: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 5,
  },
  heroImage: {
    width: 200, // Adjust size as needed
    height: 200, // Adjust size as needed
    resizeMode: 'contain',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    width: '80%', // Make buttons slightly narrower
    alignSelf: 'center', // Center them
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default RequestEntryScreen;
