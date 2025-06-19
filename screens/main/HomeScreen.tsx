// HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetcher } from '@/utils/fetcher';
import { API_URLS } from '@/config/api';
import { colors } from '@/styles/commonStyles'; // Import colors from commonStyles

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isAvailableForTasks, setIsAvailableForTasks] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setLoadingUser(true);
      try {
        const apiUserData = await fetcher(API_URLS.users.profile);
        if (apiUserData && !apiUserData.error) {
          setUserData(apiUserData);
          setIsVolunteer(apiUserData.account_type === 'volunteer');
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
            setIsVolunteer(parsedData.account_type === 'volunteer');
            if (parsedData.account_type === 'volunteer' && typeof parsedData.is_available_for_tasks === 'boolean') {
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

  const toggleAvailability = async () => {
    const newAvailability = !isAvailableForTasks;
    setIsAvailableForTasks(newAvailability);
    try {
      // Example API call (adjust URL and body as per your backend)
      // await fetcher(API_URLS.users.updateAvailability, {
      //   method: 'POST',
      //   body: JSON.stringify({ is_available_for_tasks: newAvailability }),
      // });
      console.log(`Availability changed to: ${newAvailability ? 'Available' : 'Unavailable'}`);
      Alert.alert("Status Updated", `You are now ${newAvailability ? 'available' : 'unavailable'} for tasks.`);
    } catch (error) {
      console.error("Failed to update availability:", error);
      Alert.alert("Error", "Failed to update availability status. Please try again.");
      setIsAvailableForTasks(!newAvailability);
    }
  };

  const handleTrackFamilyMember = () => {
    navigation.navigate('MyFamily');
  };

  const handleJoinFamily = () => {
    navigation.navigate('MyFamily');
  };

  const handleDonateNow = () => {
    navigation.navigate('Donate');
  };

  const handleRequestNeeds = () => {
    navigation.navigate('RequestEntry');
  };

  const handleVolunteerSpecificAction = () => {
    if (isVolunteer) {
      navigation.navigate('CurrentTasks');
    } else {
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
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => console.log('Notification Bell Pressed')} style={styles.notificationBell}>
          <Ionicons name="notifications" size={26} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Tracking Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeader2}>
            <Text style={styles.sectionTitle}>Tracking</Text>
            <Switch
              onValueChange={toggleTracking}
              value={trackingEnabled}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={trackingEnabled ? "#f5dd4b" : "#f4f3f4"}
              style={[styles.trackingSwitch, { transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }]}
            />
          </View>
          <Ionicons name="grid" size={24} color="#333" style={styles.gridIcon} />
        </View>

        <View style={styles.trackingCards}>
          <TouchableOpacity style={styles.card} onPress={handleTrackFamilyMember}>
            <Image
              source={require('../../assets/images/pin-image.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Track Family Member</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={handleJoinFamily}>
            <Image
              source={require('../../assets/images/family-image.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Join Family</Text>
          </TouchableOpacity>
        </View>

        {/* Common Action Buttons */}
        <TouchableOpacity style={styles.actionButton} onPress={handleDonateNow}>
          <MaterialCommunityIcons name="hand-heart" size={30} color="#17A2B8" />
          <Text style={styles.actionButtonText}>Donate Now</Text>
          <Ionicons name="arrow-forward" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleRequestNeeds}>
          <MaterialCommunityIcons name="medical-bag" size={30} color="#17A2B8" />
          <Text style={styles.actionButtonText}>Request Needs</Text>
          <Ionicons name="arrow-forward" size={30} color="#333" />
        </TouchableOpacity>

        {/* Conditional Volunteer Tools / Volunteer Now */}
        {isVolunteer ? (
          <View style={styles.volunteerToolsContainer}>
            <Text style={styles.volunteerToolsTitle}>Volunteer Tools</Text>
            <View style={[styles.availabilityStatusRow, { padding: 18 }]}>
              <Text style={[styles.availabilityStatusText]}>Availability Status</Text>
              <Switch
              onValueChange={toggleAvailability}
              value={isAvailableForTasks}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isAvailableForTasks ? "#f5dd4b" : "#f4f3f4"}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              />
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={handleVolunteerSpecificAction}>
              <MaterialCommunityIcons name="clipboard-list" size={30} color="#17A2B8" />
              <Text style={styles.actionButtonText}>Current Tasks</Text>
              <Ionicons name="arrow-forward" size={30} color="#333" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={handleVolunteerSpecificAction}>
            <MaterialCommunityIcons name="account-group" size={30} color="#17A2B8" />
            <Text style={styles.actionButtonText}>Volunteer Now</Text>
            <Ionicons name="arrow-forward" size={30} color="#333" />
          </TouchableOpacity>
        )}
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
    backgroundColor: colors.primary, // Using primary color for header background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: colors.primary
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
    marginLeft: 0, // Adjust to make space for menu icon
  },
  notificationBell: {
    padding: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  sectionHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeader2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  trackingSwitch: {
    marginLeft: 17,
  },
  gridIcon: {
    width: 31,
    height: 31,
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
    aspectRatio: 1, // To make cards square
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
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
  // Volunteer Tools Specific Styles
  volunteerToolsContainer: {
    width: '100%',
    marginTop: 10,
  },
  volunteerToolsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  availabilityStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F2FF', // Light green background
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderColor: '#E0F2FF',
    borderWidth: 1,
  },
  availabilityStatusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000', // Dark green text
  },
});