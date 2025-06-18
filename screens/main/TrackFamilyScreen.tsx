"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetcher } from "@/utils/fetcher";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../styles/commonStyles";
import MapView, { Marker } from "react-native-maps";
import { API_URLS } from "@/config/api";
import { getUserId } from "@/utils/storage";

const { width, height } = Dimensions.get("window");

const TrackFamilyScreen = ({ route, navigation }: any) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const selectedMember = route.params?.selectedMember;
  const [memberLocation, setMemberLocation] = useState<any>(null);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  const animateMapToLocation = useCallback((location: any) => {
    if (!location) return;
    
    const newRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      longitudeDelta: 0.01,
      latitudeDelta: 0.01,
    };
    
    // Always update marker position
    setMemberLocation(location);
    
    // Schedule map animation
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }, 50);
  }, []);

  useEffect(() => {
const loadInitialData = async () => {
    setIsLoading(true);
    try {
      if (selectedMember && selectedMember.locationSharingEnabled) {
        const locationRes = await fetcher(
          API_URLS.family.memberLocation(selectedMember.id)
        );
        if (locationRes.success && locationRes.location) {
          const newLocation = {
            latitude: parseFloat(locationRes.location.latitude),
            longitude: parseFloat(locationRes.location.longitude),
            timestamp: locationRes.location.last_location_update,
          }
          
          animateMapToLocation(newLocation);
          
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setInitialLoad(false);
    }
  };

  const handleMemberPress = async (member: any) => {
    if (!member) return;

    try {
      // Fetch and process new location...
      if (member.locationSharingEnabled) {
        const locationRes = await fetcher(
          API_URLS.family.memberLocation(member.id)
        );
        
        if (locationRes.success && locationRes.location) {
          const newLocation = {
            latitude: parseFloat(locationRes.location.latitude),
            longitude: parseFloat(locationRes.location.longitude),
            timestamp: locationRes.location.last_location_update,
          };
          
          animateMapToLocation(newLocation);
        }
      }

      // Update selected member params
      navigation.setParams({
        selectedMember: {
          id: member.id,
          name: member.name,
          type: member.type,
          locationSharingEnabled: member.locationSharingEnabled || false,
        },
      });
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Failed to fetch location");
    }
  };

   loadInitialData();
    const interval = setInterval(loadInitialData, 30000);
    return () => clearInterval(interval);
  }, [selectedMember, initialLoad]);

  const handleMemberPress = async (member: any) => {
  if (!member) {
    Alert.alert("Error", "Member information not available");
    return;
  }

  try {
    if (member.locationSharingEnabled) {
      const locationRes = await fetcher(
        API_URLS.family.memberLocation(member.id)
      );
      
      if (locationRes.success && locationRes.location) {
        const newLocation = {
          latitude: parseFloat(locationRes.location.latitude),
          longitude: parseFloat(locationRes.location.longitude),
          timestamp: locationRes.location.last_location_update,
        };
        
        animateMapToLocation(newLocation);
      }
    }

    navigation.setParams({
      selectedMember: {
        id: member.id,
        name: member.name,
        type: member.type,
        locationSharingEnabled: member.locationSharingEnabled || false,
      },
    });
  } catch (error) {
    console.error("Error fetching member location:", error);
    Alert.alert("Error", "Failed to fetch member location");
  }
};

  const handleMenu = () => {
    console.log("Menu pressed");
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotifications}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {(!isMapReady || isLoading) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

      {memberLocation && (
        <MapView
          ref={mapRef}
          style={[styles.map, !isMapReady && styles.hidden]}
          initialRegion={{
            latitude: memberLocation.latitude,
            longitude: memberLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onMapReady={() => setIsMapReady(true)}
          onLayout={() => {
            // Force initial map position on first layout
            if (memberLocation) {
              mapRef.current?.animateToRegion({
                latitude: memberLocation.latitude,
                longitude: memberLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 100);
            }
          }}
        >

            <Marker
              coordinate={{
                latitude: memberLocation.latitude,
                longitude: memberLocation.longitude,
              }}
              title={selectedMember.name}
              description={`Last updated: ${new Date(
                memberLocation.timestamp
              ).toLocaleString()}`}
            />
          </MapView>
        )}
      </View>

      <View style={styles.mainWhiteContainer}>
        <Text style={styles.familyListTitle}>Family Members</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <ScrollView
            style={styles.membersList}
            showsVerticalScrollIndicator={false}
          >
            {familyMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberItem,
                  selectedMember.id === member.id && styles.selectedMemberItem,
                ]}
                onPress={() => handleMemberPress(member)} // Use the handleMemberPress function
              >
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>{member.name?.[0] || "?"}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberType}>{member.type}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: member.locationSharingEnabled
                          ? "#4CAF50"
                          : "#FF5252",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: member.locationSharingEnabled
                          ? "#4CAF50"
                          : "#FF5252",
                      },
                    ]}
                  >
                    {member.locationSharingEnabled ? "Online" : "Offline"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  selectedMemberItem: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  loadingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  hidden: {
    opacity: 0,
  },
  mapContainer: {
    height: height * 0.4,
    width: "100%",
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "bold",
  },
  notificationButton: {
    padding: 10,
  },
  notificationIcon: {
    fontSize: 24,
    color: colors.white,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    fontSize: 24,
    color: colors.primary,
    marginBottom: 10,
  },
  mapSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  selectedMemberText: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 10,
    fontWeight: "600",
  },
  mainWhiteContainer: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: 30, // Added top padding for breathing room
    paddingHorizontal: 20,
    // No margin - reaches directly to map
  },
  familyListTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  membersList: {
    flex: 1,
  },
  memberItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.fieldBg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatar: {
    fontSize: 24,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 2,
  },
  memberType: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
});

export default TrackFamilyScreen;
