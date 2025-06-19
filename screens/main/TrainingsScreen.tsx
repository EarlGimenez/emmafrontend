"use client";

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, commonStyles } from "@/styles/commonStyles"; // Assuming common styles

const imageMap: { [key: string]: any } = {
  "train1": require("../../assets/images/train1.jpg"),
  "train2": require("../../assets/images/train2.jpg"),
  "train3": require("../../assets/images/train3.png"),
  "train4": require("../../assets/images/train4.png"),
}

// Dummy data for demonstration. This will eventually come from your Laravel API.
const DUMMY_TRAININGS = [
  {
    id: "1",
    title: "Community-Based Disaster Risk Reduction (CBDRR) for PWDs",
    description: "Learn essential strategies for disaster preparedness and response tailored for Persons With Disabilities (PWDs) in a community setting.",
    image: "train1", // Placeholder image
  },
  {
    id: "2",
    title: "First Aid & Basic Life Support Training",
    description: "Comprehensive training on providing immediate medical assistance and life-saving techniques during emergencies.",
    image: "train2", // Placeholder image
  },
  {
    id: "3",
    title: "Psychological First Aid (PFA) for Disaster Responders",
    description: "Training to provide initial mental and emotional support to individuals affected by traumatic events.",
    image: "train3", // Placeholder image
  },
  {
    id: "4",
    title: "Shelter Management and Evacuation Procedures",
    description: "Understand the principles of managing evacuation centers and effective evacuation protocols.",
    image: "train4", // Placeholder image
  },
];

const TrainingsScreen = () => {
  const navigation = useNavigation<any>();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from your API
    const fetchTrainings = async () => {
      setLoading(true);
      try {
        // Assuming you'll have an API_URLS.trainings.index for this
        // const response = await fetcher(API_URLS.trainings.index);
        // if (response.success && response.data) {
        //   setTrainings(response.data);
        // } else {
        //   Alert.alert("Error", response.message || "Failed to load trainings.");
        //   setTrainings([]); // Clear data on error
        // }
        
        // For now, use dummy data
        setTimeout(() => { // Simulate API call delay
            setTrainings(DUMMY_TRAININGS);
            setLoading(false);
        }, 1000);

      } catch (error: any) {
        console.error("Error fetching trainings:", error.message);
        Alert.alert("Error", "Could not load trainings. Please check your connection.");
        setTrainings([]);
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrainings(); // Refresh trainings every time the screen is focused
    });

    fetchTrainings(); // Initial fetch
    return unsubscribe;
  }, [navigation]);

  const handleJoinTraining = async (trainingId: string, trainingTitle: string) => {
    Alert.alert(
      "Join Training",
      `Are you sure you want to join "${trainingTitle}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Join",
          onPress: async () => {
            // Implement API call to join training
            try {
              // Assuming API_URLS.trainings.join endpoint
              // const response = await fetcher(API_URLS.trainings.join, {
              //   method: 'POST',
              //   body: JSON.stringify({ training_id: trainingId }),
              // });
              // if (response.success) {
              //   Alert.alert("Success", `You have joined "${trainingTitle}"!`);
              //   // Optionally refresh the list or update local state to reflect joined status
              // } else {
              //   Alert.alert("Failed", response.message || "Could not join training.");
              // }

              // Simulate success for dummy data
              Alert.alert("Success", `You have joined "${trainingTitle}"! (Simulated)`);
              console.log(`User joined training: ${trainingId}`);

            } catch (error: any) {
              console.error("Error joining training:", error.message);
              Alert.alert("Error", "An error occurred while trying to join training.");
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
        <Text style={styles.loadingText}>Loading Trainings...</Text>
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
          <Text style={commonStyles.backButtonText}>← Trainings</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={commonStyles.title}>Available Trainings</Text>

            {trainings.length === 0 ? (
              <Text style={styles.noTrainingsText}>No trainings currently available.</Text>
            ) : (
              trainings.map((training) => (
                <View key={training.id} style={styles.trainingCard}>
                  <Image source={imageMap[training.image]} style={styles.trainingImage} />
                  <View style={styles.trainingInfo}>
                    <Text style={styles.trainingTitle}>{training.title}</Text>
                    <Text style={styles.trainingDescription}>{training.description}</Text>
                    <TouchableOpacity
                      style={styles.joinButton}
                      onPress={() => handleJoinTraining(training.id, training.title)}
                    >
                      <Text style={styles.joinButtonText}>Join Training</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
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
  },
  noTrainingsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 30,
  },
  trainingCard: {
    flexDirection: "row",
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center", // Align items vertically in the center
  },
  trainingImage: {
    width: 80,
    height: '100%',
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
  },
  trainingInfo: {
    flex: 1, // Take remaining space
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  trainingDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "flex-start", // Align button to the left within its container
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TrainingsScreen;
