"use client"

import { useState, useEffect } from "react"
import { fetcher } from "@/utils/fetcher"
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../../styles/commonStyles"
import MapView, { Marker } from 'react-native-maps'
import { API_URLS } from "@/config/api"

const { width, height } = Dimensions.get('window');

const TrackFamilyScreen = ({ route, navigation }: any) => {
  const { selectedMember } = route.params;
  const [memberLocation, setMemberLocation] = useState<any>(null);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]); // Add missing state
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Fetch family members alongside location
    const fetchData = async () => {
      try {
        const [locationRes, familyRes] = await Promise.all([
          fetcher(API_URLS.family.memberLocation(selectedMember.id)),
          fetcher(API_URLS.family.current)
        ]);

        if (locationRes.success && locationRes.location) {
          setMemberLocation({
            latitude: parseFloat(locationRes.location.latitude),
            longitude: parseFloat(locationRes.location.longitude),
            timestamp: locationRes.location.last_location_update
          });
        }

        if (familyRes.success) {
          setFamilyMembers(familyRes.members || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedMember]);

  const handleMemberPress = (member: any) => {
    console.log("Tracking member:", member.name)
  }

  const handleMenu = () => {
    console.log("Menu pressed")
  }

  const handleNotifications = () => {
    console.log("Notifications pressed")
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {!isMapReady && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        
        {memberLocation && (
          <MapView
            style={[styles.map, !isMapReady && styles.hidden]}
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
              description={`Last updated: ${new Date(memberLocation.timestamp).toLocaleString()}`}
            />
          </MapView>
        )}
      </View>

      <View style={styles.mainWhiteContainer}>
        <Text style={styles.familyListTitle}>Family</Text>

        <ScrollView style={styles.membersList} showsVerticalScrollIndicator={false}>
          {familyMembers.map((member) => (
            <TouchableOpacity key={member.id} style={styles.memberItem} onPress={() => handleMemberPress(member)}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{member.avatar}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberType}>{member.type}</Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: "#4CAF50" }]} />
                <Text style={styles.statusText}>{member.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  hidden: {
    opacity: 0,
  },
  mapContainer: {
    height: height * 0.4,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
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
})

export default TrackFamilyScreen
