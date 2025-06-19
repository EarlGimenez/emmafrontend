import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ImageBackground, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetcher } from '@/utils/fetcher';
import { API_URLS } from '@/config/api';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [trackingEnabled, setTrackingEnabled] = useState(false); // Existing tracking switch
  const [userData, setUserData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isVolunteer, setIsVolunteer] = useState(false); // Volunteer status
  const [isAvailableForTasks, setIsAvailableForTasks] = useState(false); // NEW: Volunteer availability status

  useEffect(() => {
    const loadUserData = async () => {
      setLoadingUser(true);
      try {
        const apiUserData = await fetcher(API_URLS.users.profile);
        if (apiUserData && !apiUserData.error) {
          setUserData(apiUserData);
          setIsVolunteer(apiUserData.account_type === 'volunteer');
          // If the user object includes availability, initialize state from it
          if (apiUserData.account_type === 'volunteer' && typeof apiUserData.is_available_for_tasks === 'boolean') {
            setIsAvailableForTasks(apiUserData.is_available_for_tasks);
          }
          await AsyncStorage.setItem('userData', JSON.stringify(apiUserData));
          console.log("HomeScreen: User data fetched successfully from API.");
        } else {
          console.warn("HomeScreen: Failed to fetch user data from API. Attempting AsyncStorage fallback.");
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            setUserData(parsedData);
            setIsVolunteer(parsedData.account_type === 'Volunteer');
            if (parsedData.account_type === 'Volunteer' && typeof parsedData.is_available_for_tasks === 'boolean') {
              setIsAvailableForTasks(parsedData.is_available_for_tasks);
            }
            console.log("HomeScreen: Loaded user data from AsyncStorage as fallback.");
          } else {
            console.warn("HomeScreen: No user data in API or AsyncStorage. Redirecting to Login.");
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            navigation.replace('Login');
          }
        }
      } catch (apiError: any) {
        console.error("HomeScreen: Failed to fetch user data from API:", apiError.message);
      } finally {
        setLoadingUser(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    loadUserData();

    return unsubscribe;
  }, [navigation]);

  const toggleTracking = () => setTrackingEnabled(previousState => !previousState);

  // NEW: Function to handle availability status toggle
  const toggleAvailability = async () => {
    const newAvailability = !isAvailableForTasks;
    setIsAvailableForTasks(newAvailability); // Optimistic update
    // You would typically send this update to your backend API here
    try {
      // Example API call (adjust URL and body as per your backend)
      // await fetcher(API_URLS.users.updateAvailability, { // You'll need to define this API_URL
      //   method: 'POST',
      //   body: JSON.stringify({ is_available_for_tasks: newAvailability }),
      // });
      console.log(`Availability changed to: ${newAvailability ? 'Available' : 'Unavailable'}`);
      Alert.alert("Status Updated", `You are now ${newAvailability ? 'available' : 'unavailable'} for tasks.`);
    } catch (error) {
      console.error("Failed to update availability:", error);
      Alert.alert("Error", "Failed to update availability status. Please try again.");
      setIsAvailableForTasks(!newAvailability); // Revert on error
    }
  };

  const handleTrackFamilyMember = () => {
    navigation.navigate('MyFamily'); // Assuming 'MyFamily' handles this feature
  };

  const handleJoinFamily = () => {
    navigation.navigate('MyFamily'); // Assuming 'MyFamily' handles this feature
  };

  const handleDonateNow = () => {
    navigation.navigate('Donate');
  };

  const handleRequestNeeds = () => {
    navigation.navigate('RequestEntry');
  };

  // This function now adapts based on volunteer status
  const handleVolunteerSpecificAction = () => {
    if (isVolunteer) {
      // If a volunteer, navigate to Current Tasks screen
      navigation.navigate('VolunteerNow'); // You'll need to define 'CurrentTasks' in your App.tsx stack
    } else {
      // If not a volunteer, navigate to the application process
      navigation.navigate('DataPrivacyConsent');
    }
  };

  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        {userData && <Text style={styles.welcomeText}>Hello, {userData.name || 'User'}!</Text>}
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* NEW: Availability Status for Volunteers */}
        {isVolunteer && (
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityText}>Availability Status</Text>
            <View style={styles.availabilityToggle}>
              <Text style={styles.availabilityLabel}>
                {isAvailableForTasks ? 'Available' : 'Unavailable'}
              </Text>
              <Switch
                onValueChange={toggleAvailability}
                value={isAvailableForTasks}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isAvailableForTasks ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
          </View>
        )}

        {/* Tracking Status - Appears for both general users and volunteers */}
        <View style={styles.trackingStatusContainer}>
          <Text style={styles.trackingStatusText}>Tracking Status</Text>
          <View style={styles.trackingToggle}>
            <Text style={styles.trackingLabel}>{trackingEnabled ? 'ON' : 'OFF'}</Text>
            <Switch
              onValueChange={toggleTracking}
              value={trackingEnabled}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={trackingEnabled ? "#f5dd4b" : "#f4f3f4"}
            />
            <Ionicons name="grid" size={24} color="#333" style={styles.gridIcon} />
          </View>
        </View>

        {/* Tracking Cards */}
        <View style={styles.trackingCards}>
          <TouchableOpacity style={styles.card} onPress={handleTrackFamilyMember}>
            <Image
              source={require('../../assets/images/pin-image.png')} // Replace with your family tracking image
              style={styles.cardImage2}
            />
            <Text style={styles.cardText}>My Family</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={handleJoinFamily}>
            <Image
              source={require('../../assets/images/family-image.png')} // Placeholder
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Join Family</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDonateNow}>
            <MaterialCommunityIcons name="hand-heart" size={24} color="#333" />
            <Text style={styles.actionButtonText}>Donate Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleRequestNeeds}>
            <MaterialCommunityIcons name="medical-bag" size={24} color="#333" />
            <Text style={styles.actionButtonText}>Request Needs</Text>
            <Ionicons name="arrow-forward" size={20} color="#333" />
          </TouchableOpacity>
          {/* Volunteer-specific action button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleVolunteerSpecificAction}>
            <MaterialCommunityIcons name="account-group" size={24} color="#333" />
            <Text style={styles.actionButtonText}>
              {isVolunteer ? "Current Tasks" : "Volunteer Now"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#34495e',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  // NEW: Styles for Availability Status for Volunteers
  availabilityContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6ffe6', // Light green background
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  availabilityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#155724', // Dark green text
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#155724',
    marginRight: 8,
  },
  // Existing styles below, ensuring consistency
  trackingStatusContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  trackingStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  trackingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 8,
  },
  gridIcon: {
    width: 25,
    height: 25,
    marginLeft: 8,
  },
  trackingCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#E0F2FF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: 65,
    height: 65,
    marginTop: 10,
    resizeMode: 'contain',
  },
  cardImage2: {
    width: 48,
    height: 65,
    marginTop: 10,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  actionButtonsContainer: {
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
  },
});
