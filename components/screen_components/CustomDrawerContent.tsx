import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetcher } from '@/utils/fetcher'; // Import your fetcher utility
import { API_URLS } from '@/config/api'; // Import your API_URLS
import { colors } from '@/styles/commonStyles';

export default function CustomDrawerContent(props: any) {
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVolunteer, setIsVolunteer] = useState(false); // Default to false, update based on fetched data

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      setLoading(true);
      try {
        // Attempt to fetch fresh user data from the API
        const apiUserData = await fetcher(API_URLS.users.profile);
        if (apiUserData && !apiUserData.error) { // Check if the API response is successful
          setUserData(apiUserData);
          setIsVolunteer(apiUserData.account_type === 'Volunteer' || apiUserData.account_type === 'volunteer' || apiUserData.status === 'volunteer_pending' || apiUserData.status === 'volunteer_active'); // Adjust based on your user object's role/status field
          await AsyncStorage.setItem('userData', JSON.stringify(apiUserData)); // Cache in AsyncStorage
          console.log("CustomDrawerContent: User data fetched from API and stored.");
        } else {
          // If API fetch fails or returns an error, try loading from AsyncStorage as a fallback
          console.warn("CustomDrawerContent: Failed to fetch user data from API. Attempting AsyncStorage fallback.");
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            setUserData(parsedData);
            setIsVolunteer(parsedData.accountType === 'Volunteer' || parsedData.status === 'volunteer_pending' || parsedData.status === 'volunteer_active');
            console.log("CustomDrawerContent: User data loaded from AsyncStorage.");
          } else {
            console.warn("CustomDrawerContent: No user data found in API or AsyncStorage.");
          }
        }
      } catch (error: any) {
        console.error("CustomDrawerContent: Error fetching/loading user data:", error.message);
        // If an error occurs, ensure userData is null or handled as not authenticated
        setUserData(null);
        setIsVolunteer(false);
      } finally {
        setLoading(false);
      }
    };

    // Listen for navigation state changes (drawer opening/closing) or focus events
    // to refresh user data when the drawer is accessed.
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAndSetUserData();
    });

    // Also fetch initially when component mounts
    fetchAndSetUserData();

    return unsubscribe; // Cleanup listener
  }, [navigation]); // Depend on navigation to re-fetch when drawer opens/receives focus

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setLoading(true);
              // Call the logout API endpoint
              const response = await fetcher(API_URLS.auth.logout, { method: 'POST' });

              if (response.success) {
                Alert.alert("Success", "Logged out successfully!");
              } else {
                Alert.alert("Logout Failed", response.message || "Could not log out from the server.");
              }
              // Clear local storage regardless of API response success (as a fallback)
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              // Navigate back to the Login screen
              navigation.replace('Login');
            } catch (error: any) {
              console.error("Logout error:", error.message);
              Alert.alert("Logout Error", "An error occurred during logout. Please try again.");
              // Still clear local storage as a last resort to allow re-login
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              navigation.replace('Login'); // Force redirect
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileIconContainer}>
          {userData?.profile_picture_url ? (
            <Image source={{ uri: userData.profile_picture_url }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color="#fff" />
          )}
        </View>
        <Text style={styles.userName}>{userData?.name || 'Guest User'}</Text>
        {userData?.status && (
          <View style={styles.statusContainer}>
            <Text style={styles.userRole}>{isVolunteer ? 'Volunteer' : 'User'}</Text>
            {isVolunteer && <MaterialCommunityIcons name="check-decagram" size={16} color="#007bff" style={styles.verifiedIcon} />}
            <View style={[styles.activeDot, userData.status === 'active' ? {backgroundColor: '#28a745'} : {backgroundColor: '#ffc107'}]} />
            <Text style={styles.activeStatus}>{userData.status === 'active' ? 'Active' : 'Pending'}</Text>
          </View>
        )}
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollViewContent}>
        <DrawerItemList {...props} />
        {/* Additional Drawer Items */}
        {userData?.status === 'active' && isVolunteer && (
          <DrawerItem
            label="My Volunteer Dashboard"
            onPress={() => navigation.navigate('VolunteerHome')} // Assuming you have a VolunteerHome screen
            icon={({ color, size }) => (
              <Ionicons name="compass-outline" size={size} color={color} />
            )}
          />
        )}
      </DrawerContentScrollView>
      <View style={styles.footer}>
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" size={size} color={color} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background for the drawer content
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  header: {
    backgroundColor: colors.primary, // Dark header background
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  profileIconContainer: {
    backgroundColor: '#6c757d',
    borderRadius: 45,
    padding: 5,
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 14,
    color: '#ccc',
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745', // Green color for active dot
    marginLeft: 8,
    marginRight: 4,
  },
  activeStatus: {
    fontSize: 14,
    color: '#28a745', // Green for active status text
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingTop: 10,
  },
  drawerItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    paddingBottom: 25,
  },
});
