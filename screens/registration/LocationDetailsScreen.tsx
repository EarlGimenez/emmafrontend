"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const { width } = Dimensions.get("window")

const LocationDetailsScreen = ({ navigation }: any) => {
  const [homeAddress, setHomeAddress] = useState("")
  const [pinLocation, setPinLocation] = useState<{ x: number; y: number } | null>(null)

  const handleMapTap = (event: any) => {
    const { locationX, locationY } = event.nativeEvent
    setPinLocation({ x: locationX, y: locationY })
    // In real app, this would convert coordinates to address
    setHomeAddress("123 Main Street, City, Province")
  }

  const handleConfirm = () => {
    const locationData = {
      homeAddress,
      pinLocation,
      timestamp: new Date().toISOString(),
    }

    console.log("Location details confirmed:", locationData)

    navigation.navigate("EvacuationCenter", { locationData })
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Location Details</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Location and Evacuation Details</Text>

          <View style={styles.contentContainer}>
            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Home Address</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Enter your home address"
                value={homeAddress}
                onChangeText={setHomeAddress}
                multiline
              />
            </View>

            <Text style={styles.mapLabel}>Tap on the map to pin your location</Text>

            <TouchableOpacity style={styles.mapContainer} onPress={handleMapTap}>
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>🗺️ Map Placeholder</Text>
                <Text style={styles.mapSubtext}>Tap to pin location</Text>
                {pinLocation && (
                  <View
                    style={[
                      styles.pin,
                      {
                        left: pinLocation.x - 10,
                        top: pinLocation.y - 20,
                      },
                    ]}
                  >
                    <Text style={styles.pinIcon}>📍</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity
              style={[commonStyles.button, (!homeAddress || !pinLocation) && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={!homeAddress || !pinLocation}
            >
              <Text style={commonStyles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mapLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 10,
    fontWeight: "500",
  },
  mapContainer: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e9ecef",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mapText: {
    fontSize: 24,
    marginBottom: 10,
  },
  mapSubtext: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  pin: {
    position: "absolute",
  },
  pinIcon: {
    fontSize: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
})

export default LocationDetailsScreen
