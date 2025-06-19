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
import { Ionicons } from "@expo/vector-icons";
import { API_URLS } from "@/config/api";
import { getUserId } from "@/utils/storage";
import { DrawerActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const TrackFamilyScreen = ({ route, navigation }: any) => {
  const [selectedMember, setSelectedMember] = useState<any>(route.params?.selectedMember || null);
  const [memberLocation, setMemberLocation] = useState<any>(null);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<MapView>(null);
  const currentFamilyRef = useRef<any>(null);

  // Helper to fetch and center location
  const fetchAndCenterLocation = useCallback(async (member: any) => {
    if (!member || !member.locationSharingEnabled) {
      console.log(member.locationSharingEnabled)
      setMemberLocation(null);
      return;
    }
    try {
      const locationRes = await fetcher(API_URLS.family.memberLocation(member.id));
      if (locationRes.success && locationRes.location) {
        const newLocation = {
          latitude: parseFloat(locationRes.location.latitude),
          longitude: parseFloat(locationRes.location.longitude),
          timestamp: locationRes.location.last_location_update,
        };
        setMemberLocation(newLocation);
        requestAnimationFrame(() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
          }
        });
      } else {
        setMemberLocation(null);
      }
    } catch (error) {
      setMemberLocation(null);
    }
  }, []);

  // Fetch family members and update selected member if needed
  const loadFamilyData = useCallback(async (isFirstLoad = false) => {
    if (isFirstLoad) setIsLoading(true);
    try {
      const userIdRaw = await getUserId();
      const userId = userIdRaw ?? "";
      const familyRes = await fetcher(API_URLS.family.current, { params: { userId } });
      if (familyRes.success && familyRes.members) {
        // Compare new members with ref to avoid unnecessary state updates
        if (JSON.stringify(familyRes.members) !== JSON.stringify(currentFamilyRef.current)) {
          setFamilyMembers(familyRes.members);
          currentFamilyRef.current = familyRes.members;
          let newSelected = selectedMember;
          // Auto-select the current user if no member is selected
          if (!selectedMember || !familyRes.members.some((m: { id: any; }) => m.id === selectedMember.id)) {
            newSelected = familyRes.members.find((m: { id: { toString: () => string; }; }) => m.id.toString() === userId.toString()) || familyRes.members[0];
            setSelectedMember(newSelected);
          }
          // Always fetch location for the selected member after updating
          if (newSelected) {
            await fetchAndCenterLocation(newSelected);
          }
        }
      }
    } catch (error) {
      console.error("Error loading family data:", error);
    } finally {
      if (isFirstLoad) setIsLoading(false);
    }
  }, [selectedMember, fetchAndCenterLocation]);

  // Initial load and polling
  useEffect(() => {
    loadFamilyData(true);
    const interval = setInterval(() => loadFamilyData(false), 30000);
    return () => clearInterval(interval);
  }, [loadFamilyData]);

  // Fetch location when selected member changes (manual selection)
  useEffect(() => {
    if (selectedMember) {
      fetchAndCenterLocation(selectedMember);
    }
  }, [selectedMember, fetchAndCenterLocation]);

  // Handle member press
  const handleMemberPress = async (member: any) => {
    setSelectedMember(member);
    navigation.setParams({ selectedMember: member });
    await fetchAndCenterLocation(member);
  };

  const handleMenu = () => {
    console.log("Menu pressed");
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
  };

  return (
    <View
          style={[styles.container, {backgroundColor: colors.primary}]}
        >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotifications}
        >
          <TouchableOpacity onPress={() => console.log('Notification Bell Pressed')} style={styles.notificationBell}>
          <Ionicons name="notifications" size={26} color={colors.white} />
        </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {!isMapReady && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {memberLocation ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: memberLocation.latitude,
              longitude: memberLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onMapReady={() => setIsMapReady(true)}
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
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>
              {selectedMember?.locationSharingEnabled 
                ? "Location unavailable" 
                : "Sharing disabled"}
            </Text>
          </View>
        )}
      </View>

     <View style={styles.mainWhiteContainer}>
        <Text style={styles.familyListTitle}>Family Members</Text>
        <ScrollView style={styles.membersList} showsVerticalScrollIndicator={false}>
          {familyMembers.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.memberItem,
                selectedMember.id === member.id && styles.selectedMemberItem,
              ]}
              onPress={() => handleMemberPress(member)}
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
      </View>
    </View>
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
    padding: 5,
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
  notificationBell: {
    padding: 5,
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
