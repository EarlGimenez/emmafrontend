"use client"

import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../../styles/commonStyles"
import { API_URLS } from "@/config/api"
import { fetcher } from "@/utils/fetcher"
import { getUserId } from "@/utils/storage"

const { width } = Dimensions.get("window")

const LandingScreen = ({ navigation }: any) => {
const handleCheckFamily = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      Alert.alert("Error", "User ID is required to check family status");
      return;
    }

    const response = await fetcher(API_URLS.family.current, {
      params: { userId }
    });
    
    if (response.success && response.familyName) {
      navigation.navigate("MyFamily");
    } else {
      navigation.navigate("CheckFamily");
    }
  } catch (error) {
    console.error('Error checking family status:', error);
    Alert.alert("Error", "Failed to check family status");
  }
};

  const handleCheckEvacuationCenter = () => {
    console.log("Check Evacuation Center pressed - placeholder")
  }

  const handleTrackFamilyMember = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    // Get current user's family info
    const response = await fetcher(API_URLS.family.current, {
      params: { userId }
    });

    if (!response.success) {
      Alert.alert("Error", "Please join a family first");
      return;
    }

    // Find current user in family members
    const currentMember = response.members?.find((member: any) => member.id.toString() === userId.toString());
    
    if (!currentMember) {
      Alert.alert("Error", "Could not find your family member info");
      return;
    }

    navigation.navigate("TrackFamily", {
      selectedMember: {
        id: currentMember.id,
        name: currentMember.name,
        type: currentMember.type,
        locationSharingEnabled: currentMember.locationSharingEnabled || false
      }
    });
  } catch (error) {
    console.error("Error preparing track family screen:", error);
    Alert.alert("Error", "Failed to load family tracking");
  }
};

  const handleScanQR = () => {
    console.log("Scan QR pressed - placeholder")
  }

  const handleNotifications = () => {
    console.log("Notifications pressed")
  }

  const handleMenu = () => {
    console.log("Menu pressed")
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

      <View style={styles.mainWhiteContainer}>
        <View style={styles.content}>
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.mainButton} onPress={handleCheckFamily}>
                <View style={styles.mainButtonContent}>
                  <Text style={styles.mainButtonText}>Check Family</Text>
                  <View style={styles.familyIconContainer}>
                    <Text style={styles.familyIcon}>👨‍👩‍👧‍👦</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.mainButton} onPress={handleScanQR}>
                <View style={styles.mainButtonContent}>
                  <Text style={styles.mainButtonText}>Scan QR</Text>
                  <View style={styles.familyIconContainer}>
                    <Text style={styles.familyIcon}>📱</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.mainButton} onPress={handleCheckEvacuationCenter}>
                <View style={styles.mainButtonContent}>
                  <Text style={styles.mainButtonText}>Check Evacuation Center</Text>
                  <View style={styles.familyIconContainer}>
                    <Text style={styles.familyIcon}>🏢</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.mainButton} onPress={handleTrackFamilyMember}>
                <View style={styles.mainButtonContent}>
                  <Text style={styles.mainButtonText}>Track Family Member</Text>
                  <View style={styles.familyIconContainer}>
                    <Text style={styles.familyIcon}>📍</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
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
  mainWhiteContainer: {
    backgroundColor: colors.white,
    flex: 1,
    // No margin - reaches directly to header
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60, // Increased padding to create breathing room from header
    paddingBottom: 40,
    justifyContent: "center",
  },
  gridContainer: {
    gap: 20,
  },
  gridRow: {
    flexDirection: "row",
    gap: 15,
  },
  mainButton: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 30,
    flex: 1,
    height: 180,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  mainButtonContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    alignSelf: "flex-start",
  },
  familyIconContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  familyIcon: {
    fontSize: 40,
  },
})

export default LandingScreen
