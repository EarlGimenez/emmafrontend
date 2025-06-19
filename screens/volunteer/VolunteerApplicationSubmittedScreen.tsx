import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native'; // Import Alert
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetcher } from '@/utils/fetcher';
import { API_URLS } from '@/config/api';

// Define the RootStackParamList type, ensuring 'MainAppDrawer' is included
type RootStackParamList = {
  MainAppDrawer: undefined; // Assuming this is the name of your Drawer Navigator screen in App.tsx
  Login: undefined; 
  // Add other routes here if needed
};


export default function VolunteerApplicationSubmittedScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = React.useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      // In a real app, you might make an API call here to finalize the volunteer status
      // if it wasn't done in previous screens. For this example, we'll focus on navigation.

      // After submission, it's generally good practice to clear tokens if the user's status
      // might change or they are expected to re-authenticate (e.g., waiting for approval).
      // However, if the intention is to immediately log them into the main app (e.g., a "volunteer pending" dashboard),
      // then clearing tokens might not be desirable.
      // Given the previous conversation, we are redirecting to login to re-authenticate.
      
      // Navigate directly to the MainAppDrawer, which should be configured in App.tsx
      // to handle the drawer navigation structure. This will ensure the drawer context is available.
      // Use replace to ensure the navigation stack is clean and prevents going back to the submission screen.
      navigation.replace("MainAppDrawer"); 


    } catch (error: any) {
      console.error("Error finishing volunteer application:", error.message);
      Alert.alert("Error", "Could not finalize application process. Please try logging in.");
      navigation.replace('Login'); // Fallback to login even on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Volunteer Application</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="checkmark-circle-outline" size={100} color="#28a745" style={styles.checkmarkIcon} />
          <Text style={styles.title}>Application Submitted!</Text>
          <Text style={styles.message}>
            Thank you for submitting your volunteer application. We will review your submission and get back to you shortly.
          </Text>
          <Text style={styles.message}>
            You will receive a notification once your application has been approved.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleFinish} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Finish</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#34495e', // Dark background for header and top part
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495e',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkmarkIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#34495e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
